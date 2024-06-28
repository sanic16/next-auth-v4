import { passwordStrength } from "check-password-strength";
import { cn } from "clsx-tailwind-merge";

interface Props {
  passStrength: number;
}

const PasswordStrength = ({ passStrength }: Props) => {
  return (
    <div className="col-span-2 grid grid-cols-4 gap-2">
      {Array.from({ length: passStrength + 1 }).map((_, i) => (
        <div
          key={i}
          className={cn("h-2 rounded-md", {
            "bg-red-500": passStrength === 0,
            "bg-orange-500": passStrength === 1,
            "bg-yellow-500": passStrength === 2,
            "bg-green-500": passStrength === 3,
          })}
        ></div>
      ))}
    </div>
  );
};

export default PasswordStrength;
