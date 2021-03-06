import React, { ReactElement, Children } from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { UrlObject } from 'url';

interface Props extends LinkProps {
  activeClassName?: string;
  children: ReactElement;
  dynamic?: boolean;
}

const isActive = (regex: RegExp, url?: string | UrlObject) => {
  if (typeof url === 'string') {
    return regex.test(url);
  } else if (url && url.pathname) {
    return regex.test(url.pathname);
  }
  return false;
};
//
export function NavLink({
  children,
  activeClassName = 'active',
  dynamic,
  ...props
}: Props) {
  const { pathname, asPath } = useRouter();
  const child = Children.only(children);
  const childClassName = child.props.className || '';

  const className = [props.href, props.as].some(url =>
    dynamic
      ? isActive(
          new RegExp(`${pathname.replace(/\/?\[.*\]/, '(/[.*]$)?')}`),
          url
        )
      : url === decodeURIComponent(asPath)
  )
    ? `${childClassName} ${activeClassName}`.trim()
    : childClassName;

  return (
    <Link {...props}>
      {React.cloneElement(child, {
        className: className || null
      })}
    </Link>
  );
}
