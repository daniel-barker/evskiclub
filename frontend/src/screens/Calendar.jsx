const Calendar = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full height of the viewport
      }}
    >
      <iframe
        src="https://calendar.google.com/calendar/embed?src=d81963916aaf5fa6a8b51347516924fcfc01e8a92289bcb21079c57778faa917%40group.calendar.google.com&ctz=America%2FNew_York"
        style={{
          border: "0",
          width: "80vw", // Make it responsive by using viewport width
          height: "80vh", // Keep it responsive using viewport height
        }}
        allowFullScreen
      ></iframe>
    </div>
  );
};
export default Calendar;
