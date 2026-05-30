import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  label: string;
  pendingLabel: string;
  isPending?: boolean;
  cssClass?: string;
}

export function SubmitButton({
  label,
  pendingLabel,
  isPending: isPendingProp,
  cssClass = "w-full",
}: SubmitButtonProps) {
  const { pending: formPending } = useFormStatus();
  const pending = isPendingProp ?? formPending;
  return (
    <Button type="submit" className={cssClass} disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}
