// alert('Hello World');
// speechSynthesis api
const synth = window.speechSynthesis;
// get DOM element
const textForm = document.querySelector("#getTextForm");
const text = document.getElementById("text");
const pitch = document.getElementById("pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.getElementById("rate");
const rateValue = document.querySelector(".rate-value");
const selectVoice = document.querySelector("#selectVoice");
const btn_submit = document.getElementById("btn-submit");
const Animated = document.querySelector('.animated');
// init voices
let Voices = [];
const getVoices = () => {
  // get list of voices
  const Voices = synth.getVoices();
  Voices.forEach(voice => {
    // create option element;
    const option = document.createElement("option");
    option.innerText = voice.name + `(${voice.lang})`;
    // set data and lang attr on option
    option.setAttribute("data-length", voice.lang);
    option.setAttribute("data-name", voice.name);
    selectVoice.appendChild(option);
  });
};
// check for onvoicesChange event;
if (synth.onvoiceschanged !== "undefined") {
  synth.onvoiceschanged = getVoices;
}
// you need to invoke the function  again,
// so it works on firefox
getVoices();

// textfield eventHandler
textForm.addEventListener("submit", e => {
  // prevent default behaviour;
  e.preventDefault();
  // create instance of speechUtterance;
  const utterThis = new SpeechSynthesisUtterance(text.value);
  // validate text field
  if (!text.value) {
    return alert("Can't Speak, Text Field Is Empty");
  } else {
    const selectedOption = selectVoice.selectedOptions[0].getAttribute(
      "data-name"
    );
    // loop on voice list
    for (let i = 0; i < Voices.length; i++) {
      if (Voices[i].name == selectedOption) {
        utterThis.voice = Voices[i];
      }
    }
    // check for error
    utterThis.onerror = err => {
      console.log("Internal Error: ", err);
    };
    // when start speaking
    utterThis.onstart = () => {
      btn_submit.innerText = "Speaking...";

      Animated.classList.remove('hidden');
      rate.setAttribute("disabled", "disabled");
      pitch.setAttribute("disabled", "disabled");
      text.setAttribute("disabled", "disabled");
      btn_submit.setAttribute("disabled", "disabled");
      selectVoice.setAttribute('disabled', 'disabled')
    };
    // speak ends
    utterThis.onend = () => {
      Animated.classList.add('hidden')
      console.log("done speaking");

      text.removeAttribute("disabled", "disabled");
      pitch.removeAttribute("disabled", "disabled");
      rate.removeAttribute("disabled", "disabled");
      btn_submit.removeAttribute("disabled", "disabled");
      selectVoice.removeAttribute('disabled', 'disabled')
      btn_submit.innerText = "Speak";
    };
    // set pitch and rate
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    // speak
    synth.speak(utterThis);
  }
});
// set default pitch and rate value
const trackPitchValue = () => {
  pitchValue.innerText = pitch.value;
};
const trackRateValue = () => {
  rateValue.innerText = rate.value;
};
// invoke pitch&rate tracker
trackPitchValue();
trackRateValue();

// update rate and pitch when value changes
pitch.addEventListener("change", e => {
  pitchValue.innerText = e.target.value;
});
rate.addEventListener("change", e => {
  rateValue.innerText = e.target.value;
});