import React, { MouseEvent } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { createUserForm } from '@/components/UserForm';
import { Toaster } from '@/utils/toaster';
import { getProfile, updateProfile as updateProfileAPI } from '@/service';
import { AuthState, AuthActions } from '@/hooks/useAuth';

export interface OnClick {
  onClick?: (event: MouseEvent<any>) => void;
}

interface Props {
  auth: AuthState;
  actions: AuthActions;
}

const { Form, Nickname, Email, useForm } = createUserForm();

const title = '更改帳號資料';

const onFailure = Toaster.apiError.bind(Toaster, `Update profile failure`);

export function withUpdateProfile<P extends OnClick>(
  Component: React.ComponentType<P>
) {
  return function WithUpdateProfile({ auth, actions, ...props }: P & Props) {
    const [form] = useForm();

    useRxAsync(getProfile, {
      defer: !!auth.user?.email,
      onSuccess: actions.updateProfile,
      onFailure
    });

    async function onConfirm() {
      if (!auth.user?.id) {
        throw new Error(`user id is not defined`);
      }

      const payload = await form.validateFields();

      try {
        const response = await updateProfileAPI({
          ...payload,
          id: auth.user.id
        });
        actions.updateProfile(response);

        Toaster.success({ message: `Update profile success` });
      } catch (error) {
        Toaster.apiError(`Update profile failure`, error);
        throw error;
      }
    }

    function handleClick() {
      form.resetFields();
      openConfirmDialog({
        title,
        onConfirm,
        icon: 'user',
        confirmText: '確認',
        cancelText: '取消',
        children: (
          <Form
            form={form}
            key={JSON.stringify(auth.user)}
            initialValues={auth.user ? auth.user : undefined}
          >
            <Nickname />
            <Email />
          </Form>
        )
      });
    }

    return (
      <Component {...((props as unknown) as P)} onClick={handleClick}>
        {title}
      </Component>
    );
  };
}
