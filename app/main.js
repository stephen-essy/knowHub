// Enhanced timetable parser with UI alerts and day-aware merging

import { alert } from "./ui.js";

window.addEventListener("DOMContentLoaded", () => {
  const filePicker = document.getElementById("file-picker");
  const uploadBtn = document.getElementById("upload");
  const removeBtn = document.getElementById("delete");
  const output = document.getElementById("output");
  let file = null;

  filePicker.addEventListener("change", (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      file = selected;
      document.getElementById("file-name").textContent = selected.name;
      alert("PDF file selected!", "success");
    } else {
      filePicker.value = "";
      file = null;
      alert("Only PDF files are allowed.", "error");
    }
  });

  removeBtn.addEventListener("click", () => {
    filePicker.value = "";
    file = null;
    document.getElementById("file-name").textContent = "Time Table";
    output.textContent = "";
    alert("File removed", "success");
  });

  uploadBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a PDF file first.", "error");
      return;
    }

    try {
      uploadBtn.classList.add("spinner");
      const text = await extractTextFromPDF(file);
      const rawLines = text.split("\n").map(line => line.trim()).filter(Boolean);
      const normalized = normalizeTimetable(rawLines);
      const structured = parseNormalizedEvents(normalized);

      //output.textContent = JSON.stringify(structured, null, 2);
      console.log(structured);
      alert("Timetable processed successfully!", "success");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while parsing the PDF.", "error");
    } finally {
      uploadBtn.classList.remove("spinner");
    }
  });

  async function extractTextFromPDF(file) {
    const pdfjsLib = window["pdfjs-dist/build/pdf"];
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      fullText += strings.join("\n") + "\n";
    }
    return fullText;
  }

  function normalizeTimetable(lines) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const normalized = [];
    let currentDay = null;
    let buffer = [];

    lines.forEach((line) => {
      const day = days.find((d) => new RegExp(`\\b${d}\\b`, 'i').test(line));
      if (day) {
        if (buffer.length && currentDay) {
          normalized.push({ day: currentDay, text: buffer.join(" ") });
        }
        currentDay = day;
        buffer = [line];
      } else if (/\d{2}:\d{2}\s*-\s*\d{2}:\d{2}/.test(line) && buffer.length > 0) {
        normalized.push({ day: currentDay, text: buffer.join(" ") });
        buffer = [line];
      } else {
        buffer.push(line);
      }
    });

    if (buffer.length && currentDay) {
      normalized.push({ day: currentDay, text: buffer.join(" ") });
    }

    return normalized.map((e) => {
      return {
        day: e.day,
        text: e.text.replace(new RegExp(`^${e.day}\\s*`, "i"), "").trim()
      };
    });
  }

  function parseNormalizedEvents(events) {
    const timetable = [];
    const dayMap = new Map();

    events.forEach(({ day, text }) => {
      const pattern = /(\d{2}:\d{2}\s*-\s*\d{2}:\d{2}),\s*(.+?)\s*-\s*(Lecture|Tutorial|Practical).*?Staff\s*:\s*(.*?);\s*Students\s*:\s*(.*?);\s*Venue\s*:\s*(.+)/i;
      const match = text.match(pattern);
      if (match) {
        const [, time, course, type, staff, students, venue] = match;
        if (!dayMap.has(day)) dayMap.set(day, []);
        dayMap.get(day).push({
          time: time.trim(),
          course: course.trim(),
          type: type.trim(),
          staff: staff.trim(),
          students: students.trim(),
          venue: venue.trim()
        });
      }
    });

    for (const [day, events] of dayMap.entries()) {
      timetable.push({ day, events });
    }

    return timetable;
  }
});
