const RoadMapDay = ({ day }) => {
  return (
    <div className="relative flex flex-col gap-2 py-3 pl-14">
      {/* Timeline dot */}
      <span className="absolute left-[21px] top-[1.05rem] h-3.5 w-3.5 rounded-full border-2 border-[#ff2d78] bg-[#161b22]" />

      {/* Header */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="rounded-full border border-[#ff2d78]/25 bg-[#ff2d78]/10 px-2 py-0.5 text-[0.7rem] font-bold text-[#ff2d78]">
          Day {day.day}
        </span>

        <h3 className="m-0 text-[0.95rem] font-semibold text-[#e6edf3]">
          {day.focus}
        </h3>
      </div>

      {/* Tasks */}
      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {day.tasks.map((task, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-[0.845rem] leading-[1.5] text-[#969da7]"
          >
            <span className="mt-2 h-[5px] w-[5px] shrink-0 rounded-full bg-[#7d8590]" />
            {task}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoadMapDay;
