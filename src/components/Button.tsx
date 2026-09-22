import { Link } from "@tanstack/react-router";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type StaticRoute = "/" | "/about" | "/admissions" | "/blog" | "/book-a-tour" | "/daily-routine" | "/event-calendar" | "/gallery" | "/privacy-policy" | "/program" | "/refund-policy" | "/terms";
type Props = { children: ReactNode; to?: StaticRoute; variant?: "primary" | "outline" | "light"; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>;
export function Button({ children, to, variant = "primary", className = "", ...props }: Props) {
  const classes = `site-button site-button--${variant} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      <ArrowRight size={16} className="button-arrow" aria-hidden="true" />
    </>
  );
  if (to) return <Link to={to} className={classes}>{content}</Link>;
  return <button className={classes} {...props}>{content}</button>;
}