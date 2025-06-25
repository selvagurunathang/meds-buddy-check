import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "../../lib/utils";
// import { buttonVariants } from "../../ui/Button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "rounded-xl shadow-md p-4 ring-1 ring-gray-200 w-full", // remove max-w-sm & mx-auto
        className
      )}
      classNames={{
        months: "sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-between items-center mb-2",
        caption_label: "text-base font-semibold text-gray-800",
        nav: "flex items-center gap-1",
        // nav_button: cn(
        //   buttonVariants({ variant: "ghost" }),
        //   "h-8 w-8 p-0 hover:bg-gray-200 transition"
        // ),
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell:
          "text-xs text-gray-500 w-9 h-9 flex items-center justify-center font-medium",
        row: "flex w-full",
        cell: cn(
          "relative w-9 h-9 text-center text-sm p-0",
          "focus-within:z-10 focus-within:relative"
        ),
        // day: cn(
        //   buttonVariants({ variant: "ghost" }),
        //   "h-9 w-9 p-0 text-gray-900 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500"
        // ),
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 rounded-full",
        day_today:
          "text-blue-600 font-semibold underline underline-offset-2",
        day_outside: "text-gray-300 opacity-50",
        day_disabled: "text-gray-300 opacity-30",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
