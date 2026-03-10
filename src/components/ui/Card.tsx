import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  gold?: boolean;
}

export default function Card({ className, children, hover, gold }: CardProps) {
  return (
    <div
      className={cn(
        "bg-btg-navy-card border border-btg-navy-border rounded-2xl",
        hover && "card-hover cursor-pointer",
        gold && "border-btg-gold/30 gold-glow",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={cn("px-6 pt-6 pb-4", className)}>{children}</div>
  );
}

export function CardBody({ className, children }: CardHeaderProps) {
  return (
    <div className={cn("px-6 pb-6", className)}>{children}</div>
  );
}

export function CardFooter({ className, children }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "px-6 py-4 border-t border-btg-navy-border",
        className
      )}
    >
      {children}
    </div>
  );
}
