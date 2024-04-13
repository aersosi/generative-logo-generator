// Function to generate the SVG using paths identified by their IDs
function updateSVG() {
  const shape1 = document.getElementById("shape_1").value;
  const shape2 = document.getElementById("shape_2").value;

  const element1 = document.getElementById(shape1).cloneNode(true);
  const element2 = document.getElementById(shape2).cloneNode(true);

  const color1 = document.getElementById("color_1").value; // rgb1
  const color2 = document.getElementById("color_2").value; // rgb2

  const translateValue1 = document.getElementById("translateSelect_1").value;
  const translateValue2 = document.getElementById("translateSelect_2").value;

  const rotateValue1 = document.getElementById("rotateSelect_1").value;
  const rotateValue2 = document.getElementById("rotateSelect_2").value;

  element1.setAttribute("style", `transform: translate(${translateValue1}) rotate(${rotateValue1}); transform-origin: 2.5px 2.5px;`);
  element2.setAttribute("style", `transform: translate(${translateValue2}) rotate(${rotateValue2}); transform-origin: 2.5px 2.5px;`);

  // Convert color hex codes to RGB arrays
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const result = multiply(rgb1, rgb2);
  const resultColor = rgbToHex(...result);

  const svgTemplate = `
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 9 9" fill="none">
    <g fill="${color1}">
      ${element1.outerHTML}
    </g>
    <g fill="${color2}">
      ${element2.outerHTML}
    </g>
    <mask id="theMask" style="mask-type:alpha" maskUnits="userSpaceOnUse">
      <g fill="${resultColor}">
        ${element1.outerHTML}
      </g>
    </mask>
    <g mask="url(#theMask)" fill="${resultColor}">
        ${element2.outerHTML}
    </g>
  </svg>`;

  document.getElementById("svgContainer").innerHTML = svgTemplate;
}

const hexToRgb = hex => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
};
const rgbToHex = (r, g, b) => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
const multiply = (rgb1, rgb2) => rgb1.map((c, i) => Math.floor(c * rgb2[i] / 255));

function setRandomIndex(selectElement, excludeIndex) {
  const optionsCount = selectElement.options.length;
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * (optionsCount - 1)) + 1;
  } while (randomIndex === excludeIndex);
  selectElement.selectedIndex = randomIndex;
}

function randomizeShapes() {
  const shapeSelect1 = document.getElementById("shape_1");
  const shapeSelect2 = document.getElementById("shape_2");

  setRandomIndex(shapeSelect1);
  setRandomIndex(shapeSelect2, shapeSelect1.selectedIndex);

  updateSVG();
}

function randomizeColors() {
  const colorSelect1 = document.getElementById('color_1');
  const colorSelect2 = document.getElementById('color_2');

  setRandomIndex(colorSelect1);
  setRandomIndex(colorSelect2, colorSelect1.selectedIndex);

  updateSVG();
}

function randomizePosition() {
  const positionSelect1 = document.getElementById('translateSelect_1');
  const positionSelect2 = document.getElementById('translateSelect_2');

  setRandomIndex(positionSelect1);
  setRandomIndex(positionSelect2, positionSelect1.selectedIndex);

  updateSVG();
}

function randomizeRotation() {
  const rotateSelect1 = document.getElementById('rotateSelect_1');
  const rotateSelect2 = document.getElementById('rotateSelect_2');

  setRandomIndex(rotateSelect1);
  setRandomIndex(rotateSelect2, rotateSelect1.selectedIndex);

  updateSVG();
}

function downloadSVG() {
  // Get the SVG element from the DOM
  const svgElement = document.getElementById("svgContainer").querySelector('svg');

  // Serialize the SVG to a string
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);

  // Create a Blob from the SVG string
  const svgBlob = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});

  // Create a URL for the Blob
  const svgUrl = URL.createObjectURL(svgBlob);

  // Create a download link and trigger the download
  const downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = "downloaded_svg.svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink); // Clean up
}

document.addEventListener("DOMContentLoaded", (event) => {
  updateSVG();

  const svgUpdateElements = document.querySelectorAll('.updateSVG');
  svgUpdateElements.forEach(element => {
    element.addEventListener("change", updateSVG);
  });

  document.getElementById("randomizeShapes").addEventListener("click", randomizeShapes);
  document.getElementById("randomizeColors").addEventListener("click", randomizeColors);
  document.getElementById("randomizePosition").addEventListener("click", randomizePosition);
  document.getElementById("randomizeRotation").addEventListener("click", randomizeRotation);

  document.getElementById("downloadButton").addEventListener("click", downloadSVG);
});

