document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector('.talk');
    const sendBtn = document.querySelector('#sendBtn');
    const textInput = document.querySelector('#textInput');
    const chatbox = document.querySelector('#chatbox');
    const medicalLink = document.querySelector('#medicalLink');

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
        fever: {
            keywords: ["fever", "high temperature", "hot body", "feeling hot", "chills"],
            advice: "For fever, stay hydrated and rest. If temperature is above 102°F, consult a doctor.",
            link: "https://www.webmd.com/cold-and-flu/fever"
        },
        headache: {
            keywords: ["headache", "head pain", "pressure in head", "migraine", "light sensitivity"],
            advice: "Headaches may be caused by dehydration or stress. Drink water, rest, and avoid screens.",
            link: "https://www.mayoclinic.org/diseases-conditions/headache/symptoms-causes"
        },
        cold: {
            keywords: ["cold", "running nose", "sneezing", "stuffy nose", "nasal congestion"],
            advice: "For a cold, drink warm fluids, rest, and use steam inhalation.",
            link: "https://www.webmd.com/cold-and-flu/cold-guide/default.htm"
        },
        cough: {
            keywords: ["cough", "throat pain", "sore throat", "dry cough", "wet cough"],
            advice: "For a cough, drink warm honey tea and avoid cold drinks.",
            link: "https://www.healthline.com/health/how-to-get-rid-of-a-cough"
        },
        stomach_pain: {
            keywords: ["stomach pain", "stomach ache", "abdomen pain", "cramps", "bloating"],
            advice: "For stomach pain, try a light diet, drink water, and avoid spicy foods.",
            link: "https://www.mayoclinic.org/symptoms/abdominal-pain/basics/causes"
        },
        emergency: {
            keywords: ["emergency", "unconscious", "fainting", "severe bleeding", "trouble breathing"],
            advice: "If it's an emergency, call for medical help immediately!",
            link: "https://www.redcross.org/get-help/how-to-prepare-for-emergencies.html"
        }
    };

    function handleHealthQuery(message) {
        for (let symptom in symptoms) {
            for (let keyword of symptoms[symptom].keywords) {
                if (message.includes(keyword)) {
                    provideAdvice(symptom);
                    return;
                }
            }
        }
        speak("I'm not sure about that. Please consult a medical professional.");
        medicalLink.href = "#"; // Disable link if no result found
    }

    function provideAdvice(symptom) {
        let response = symptoms[symptom].advice;
        let link = symptoms[symptom].link;

        speak(response);
        medicalLink.href = link;
        medicalLink.textContent = "Learn More";
    }
});
