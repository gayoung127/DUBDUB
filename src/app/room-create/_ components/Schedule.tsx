import React from "react";
import SearchIcon from "@/public/images/icons/icon-search.svg";
import CalenderIcon from "@/public/images/icons/icon-calender.svg";
import DropdownIcon from "@/public/images/icons/icon-dropdown.svg";

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const SelectedHour = String(hour).padStart(2, "0");
      const SelectedMinute = String(minute).padStart(2, "0");
      options.push(`${SelectedHour}:${SelectedMinute}`);
    }
  }
  return options;
};

const Schedule = () => {
  const timeOptions = generateTimeOptions();

  return (
    <section className="w-full max-w-md p-4">
      <h1 className="mb-2 text-xl font-bold">SCHEDULE</h1>

      <div className="space-y-4">
        <section>
          <h2 className="mb-1.5 text-sm font-medium">DATE</h2>
          <div className="flex items-center rounded-md border">
            <div className="pl-3">
              <SearchIcon />
            </div>
            <input
              type="text"
              value="구현해야함..."
              className="w-full rounded-md p-2 pl-2 outline-none"
              readOnly
            />
            <div className="pr-3">
              <CalenderIcon />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="mb-1.5 text-sm font-medium">START</h2>
            <div className="flex w-full items-center rounded-md border p-2">
              <select className="flex-grow appearance-none bg-transparent outline-none">
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <DropdownIcon className="ml-2 text-gray-500" />
            </div>
          </div>

          <div>
            <h2 className="mb-1.5 text-sm font-medium">END</h2>
            <div className="flex w-full items-center rounded-md border p-2">
              <select className="flex-grow appearance-none bg-transparent outline-none">
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <DropdownIcon className="ml-2 text-gray-500" />
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Schedule;
