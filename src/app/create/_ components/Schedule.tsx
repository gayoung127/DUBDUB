import React from "react";
import SearchIcon from "@/public/images/icons/icon-search.svg";
import CalenderIcon from "@/public/images/icons/icon-calender.svg";
import DropdownIcon from "@/public/images/icons/icon-dropdown.svg";
import H2 from "@/app/_components/H2";

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
      <H2 className="mb-4">SCHEDULE</H2>
      <div className="space-y-6">
        <section>
          <h2 className="mb-1.5 text-sm font-medium">START</h2>
          <div className="flex items-center space-x-4">
            <div className="flex flex-grow items-center rounded-md border px-3 py-2">
              <SearchIcon className="mr-2" />
              <input
                type="text"
                value="25.02.21"
                className="w-full bg-transparent outline-none"
                readOnly
              />
              <CalenderIcon />
            </div>
            <div className="flex items-center rounded-md border px-3 py-2">
              <select className="appearance-none bg-transparent outline-none">
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

        <section>
          <h2 className="mb-1.5 text-sm font-medium">END</h2>
          <div className="flex items-center space-x-4">
            <div className="flex flex-grow items-center rounded-md border px-3 py-2">
              <SearchIcon className="mr-2" />
              <input
                type="text"
                value="25.02.21"
                className="w-full bg-transparent outline-none"
                readOnly
              />
              <CalenderIcon />
            </div>
            <div className="flex items-center rounded-md border px-3 py-2">
              <select className="appearance-none bg-transparent outline-none">
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
