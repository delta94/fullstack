import React from 'react';
import { CardWithLogo } from '@/components/CardWithLogo';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export default function AdminAuth() {
  return (
    <div className="container">
      <CardWithLogo title="睇小說">
        <AdminLoginForm />
      </CardWithLogo>
      <style jsx>
        {`
          .container {
            @include absolute(0, null, null 0);
            @include sq-dimen(100%);
            @include flex(center, center);
          }
        `}
      </style>
    </div>
  );
}
