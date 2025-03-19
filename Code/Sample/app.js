document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector('.talk');
    const sendBtn = document.querySelector('#sendBtn');
    const textInput = document.querySelector('#textInput');
    const chatbox = document.querySelector('#chatbox');

    function speak(text) {
        const text_speak = new SpeechSynthesisUtterance(text);
        text_speak.rate = 1;
        text_speak.volume = 1;
        text_speak.pitch = 1;
        window.speechSynthesis.speak(text_speak);
        displayMessage("Bot: " + text);
    }

    function displayMessage(message) {
        const messageElement = document.createElement("p");
        messageElement.textContent = message;
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    function greetUser() {
        let hour = new Date().getHours();
        let greeting = hour < 12 ? "Good Morning! " : hour < 18 ? "Good Afternoon! " : "Good Evening! ";
        speak(greeting + "I am your Virtual Health Assistant. How can I assist you today?");
    }

    speak("Initializing Virtual Health Assistant...");
    greetUser();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
        displayMessage("You: " + transcript);
        handleHealthQuery(transcript);
    };

    btn.addEventListener('click', () => {
        displayMessage("You: Listening...");
        recognition.start();
    });

    sendBtn.addEventListener('click', () => {
        let userInput = textInput.value.trim();
        if (userInput) {
            displayMessage("You: " + userInput);
            handleHealthQuery(userInput.toLowerCase());
            textInput.value = "";
        }
    });

    // Symptom Database
    const symptoms = {
        fever: ["fever", "high temperature", "hot body", "feeling hot", "chills"],
        headache: ["headache", "head pain", "pressure in head", "migraine", "light sensitivity"],
        cold: ["cold", "running nose", "sneezing", "stuffy nose", "nasal congestion"],
        cough: ["cough", "throat pain", "sore throat", "dry cough", "wet cough"],
        stomach_pain: ["stomach pain", "stomach ache", "abdomen pain", "cramps", "bloating"],
        nausea: ["nausea", "vomiting", "feeling sick", "upset stomach", "queasy"],
        diarrhea: ["diarrhea", "loose motions", "frequent stool", "upset stomach"],
        chest_pain: ["chest pain", "tightness in chest", "pain in heart", "breathing difficulty"],
        fatigue: ["fatigue", "tired", "exhausted", "low energy", "weakness"],
        allergy: ["allergy", "itchy skin", "rash", "swelling", "breathing trouble"],
        anxiety: ["anxiety", "stress", "panic", "nervous", "feeling uneasy"],
        emergency: ["emergency", "unconscious", "fainting", "severe bleeding", "trouble breathing"]
    };

    function handleHealthQuery(message) {
        for (let symptom in symptoms) {
            for (let keyword of symptoms[symptom]) {
                if (message.includes(keyword)) {
                    provideAdvice(symptom);
                    return;
                }
            }
        }
        speak("I'm not sure about that. Please consult a medical professional.");
    }

    function provideAdvice(symptom) {
        let response = "";

        switch (symptom) {
            case "fever":
                response = "For fever, stay hydrated and rest. If temperature is above 102°F, consult a doctor.";
                break;
            case "headache":
                response = "Headaches may be caused by dehydration or stress. Drink water, rest, and avoid screens.";
                break;
            case "cold":
                response = "For a cold, drink warm fluids, rest, and use steam inhalation.";
                break;
            case "cough":
                response = "For a cough, drink warm honey tea and avoid cold drinks.";
                break;
            case "stomach_pain":
                response = "For stomach pain, try a light diet, drink water, and avoid spicy foods.";
                break;
            case "emergency":
                response = "If it's an emergency, call for medical help immediately!";
                break;
            default:
                response = "I'm not sure. Please consult a doctor.";
        }

        speak(response);
    }
});
