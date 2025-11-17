import { ReactNode } from "react";

type CardVariant = "subtle" | "solid";

const variantClasses: Record<CardVariant, string> = {
  subtle: "border-slate-800 bg-slate-950/70",
  solid: "border-slate-900 bg-slate-950/80",
};

type HomeCardProps = {
  title: string;
  body: ReactNode;
  variant?: CardVariant;
  className?: string;
  preface?: ReactNode;
  children?: ReactNode;
};

const HomeCard = ({
  title,
  body,
  variant = "solid",
  className = "",
  preface,
  children,
}: HomeCardProps) => {
  const content =
    typeof body === "string" ? (
      <p className="text-xs leading-relaxed text-slate-300">{body}</p>
    ) : (
      body
    );

  return (
    <article
      className={`rounded-xl border p-4 text-sm ${variantClasses[variant]} ${className}`}
    >
      {preface}
      <h3 className="mb-1 text-sm font-semibold text-slate-50">{title}</h3>
      {content}
      {children}
    </article>
  );
};

export default HomeCard;
