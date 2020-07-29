let file;
let headingsOnTable = [];
let uploadedFileHeadings = [];
let tableRow;
let rowObject;

let errorElement = document.querySelector(".error-message");

const getHeadersFromTable = () => {
  return document.querySelectorAll("table span");
};

const headerElements = getHeadersFromTable();
headingsOnTable = [];
[...headerElements].forEach((element) => {
  headingsOnTable.push(element.textContent.trim());
});

const compareTheHeaders = (uploadedFileData) => {
  uploadedFileHeadings = [];
  for (let key in uploadedFileData[0]) {
    uploadedFileHeadings.push(key);
  }
  if (JSON.stringify(headingsOnTable) != JSON.stringify(uploadedFileHeadings)) {
    errorElement.classList.add("make-visible");
    return;
  } else {
    errorElement.classList.remove("make-visible");
    CreateTableFromJSON(rowObject);
  }
};

const readDataFromFile = () => {
  let fileReader = new FileReader();

  if (file) {
    fileReader.readAsBinaryString(file);
    fileReader.onload = (event) => {
      let data = event.target.result;
      let workbook = XLSX.read(data, { type: "binary" });
      workbook.SheetNames.forEach((sheet) => {
        rowObject = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheet]
        );
      });

      compareTheHeaders(rowObject);
    };
  }
};

//Handle file upload
const inputField = document.querySelector(".input-file");
const chooseFile = document.querySelector(".choose-file");
chooseFile.addEventListener("click", () => {
  inputField.click();
});
inputField.addEventListener("change", (event) => {
  file = event.target.files[0];
  readDataFromFile();
});

function CreateTableFromJSON(data) {
  // EXTRACT VALUE FOR HTML HEADER.
  // ('Book ID', 'Book Name', 'Category' and 'Price')
  const col = [];
  for (let i = 0; i < data.length; i++) {
    for (let key in data[i]) {
      if (col.indexOf(key) === -1) {
        col.push(key);
      }
    }
  }

  // CREATE DYNAMIC TABLE.
  const table = document.createElement("table");

  // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

  let tr = table.insertRow(-1); // TABLE ROW.

  for (let i = 0; i < col.length; i++) {
    const th = document.createElement("th"); // TABLE HEADER.
    const img = document.createElement("img");
    img.setAttribute("src", "./icons/code.svg");
    th.appendChild(img);
    th.innerHTML = col[i];
    tr.appendChild(th);
    tr.classList.add("table-head");
  }

  // ADD JSON DATA TO THE TABLE AS ROWS.
  for (let i = 0; i < data.length; i++) {
    tr = table.insertRow(-1);

    for (let j = 0; j < col.length; j++) {
      const tabCell = tr.insertCell(-1);
      tabCell.innerHTML = data[i][col[j]];
    }
  }

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  const parsedDataTable = document.getElementById("data-table");
  const parsedDataContainer = document.querySelector(".uploaded-content");
  const upploadConsoleContainer = document.querySelector(
    ".upload-console-container"
  );
  parsedDataTable.innerHTML = "";
  parsedDataTable.appendChild(table);
  parsedDataTable.classList.add("make-visible");
  upploadConsoleContainer.classList.add("hidden");
  parsedDataContainer.classList.remove("hidden");
}

document.querySelector(".close-error-toast").addEventListener("click", () => {
  errorElement.classList.remove("make-visible");
});

//Drag and drop funcitonality
(function () {
  "use strict";

  const dropZone = document.querySelector(".upload-console-wrapper");

  dropZone.ondrop = function (event) {
    event.preventDefault();
    file = event.dataTransfer.files[0];

    //Ensure the uploaded file is .xls or .xlsx format
    if (
      file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      errorElement.classList.remove("make-visible");
      readDataFromFile();
    } else {
      errorElement.classList.add("make-visible");
      return;
    }
  };

  dropZone.ondragover = function () {
    return false;
  };

  dropZone.ondragleave = function () {
    return false;
  };
})();
