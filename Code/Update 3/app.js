document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector('.talk');
    const sendBtn = document.querySelector('#sendBtn');
    const textInput = document.querySelector('#textInput');
    const chatbox = document.querySelector('#chatbox');
    const medicalLink = document.querySelector('#medicalLink');
    const languageSelect = document.querySelector('#language'); 
    const darkModeToggle = document.querySelector('#darkModeToggle'); 

    let userLanguage = "en"; 
    let currentSymptoms = [];
    let questionIndex = 0;
    let userAnswers = {};
    let currentSymptomBeingProcessed = null;

    function speak(text) {
        const text_speak = new SpeechSynthesisUtterance(text);
        text_speak.lang = userLanguage;
        text_speak.rate = 1;
        text_speak.volume = 1;
        text_speak.pitch = 1;
        window.speechSynthesis.speak(text_speak);
        displayMessage("Bot: " + text);
    }

    function displayMessage(message, type = "bot") {
        const messageElement = document.createElement("p");
        messageElement.textContent = message;
        messageElement.classList.add(type === "user" ? "user" : "bot");
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    function greetUser() {
        let greetings = {
            "en": "Hello! I am your Virtual Health Assistant.",
            "es": "¡Hola! Soy tu asistente de salud virtual.",
            "hi": "नमस्ते! मैं आपका वर्चुअल हेल्थ असिस्टेंट हूं।",
            "ta": "வணக்கம்! நான் உங்கள் நல உதவியாளர்."
        };
        speak(greetings[userLanguage]);
    }

    languageSelect.addEventListener("change", () => {
        userLanguage = languageSelect.value;
        greetUser();
    });

    greetUser(); 

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = userLanguage;

    recognition.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
        displayMessage("You: " + transcript, "user");
        processUserResponse(transcript);
    };

    btn.addEventListener('click', () => {
        displayMessage("You: Listening...", "user");
        recognition.lang = userLanguage;
        recognition.start();
    });

    sendBtn.addEventListener('click', () => {
        let userInput = textInput.value.trim();
        if (userInput) {
            displayMessage("You: " + userInput, "user");
            processUserResponse(userInput.toLowerCase());
            textInput.value = "";
        }
    });

    const symptoms = {
        fever: {
            keywords: {
                "en": ["fever", "high temperature", "hot body", "chills"],
                "es": ["fiebre", "temperatura alta", "escalofríos"],
                "hi": ["बुखार", "तेज़ बुखार", "गर्म शरीर"],
                "ta": ["காய்ச்சல்", "உயர் வெப்பநிலை", "சளி"]
            },
            questions: {
                "en": ["Do you also have chills?", "What is your temperature?", "How long have you had the fever?"],
                "es": ["¿También tienes escalofríos?", "¿Cuál es tu temperatura?", "¿Cuánto tiempo has tenido fiebre?"],
                "hi": ["क्या आपको ठंड लग रही है?", "आपका तापमान क्या है?", "आपको कितने दिनों से बुखार है?"],
                "ta": ["உங்களுக்கு சளி உள்ளதா?", "உங்கள் வெப்பநிலை என்ன?", "நீங்கள் எத்தனை நாட்களாக காய்ச்சலால் பாதிக்கப்பட்டுள்ளீர்கள்?"]
            },
            medicine: {
                "en": "Paracetamol (Tylenol) or Ibuprofen.",
                "es": "Paracetamol (Tylenol) o Ibuprofeno.",
                "hi": "पेरासिटामोल (टायलेनोल) या इबुप्रोफेन।",
                "ta": "பாராசிட்டமால் (Tylenol) அல்லது இபுபுரோபின்."
            },
            advice: {
                "en": "Stay hydrated, rest, and monitor your temperature.",
                "es": "Mantente hidratado, descansa y controla tu temperatura.",
                "hi": "हाइड्रेटेड रहें, आराम करें और अपने तापमान की निगरानी करें।",
                "ta": "நீர்ப் பஞ்சம் தவிர்க்கவும், ஓய்வெடுக்கவும், உங்கள் வெப்பநிலையை கண்காணிக்கவும்."
            },
            link: "https://www.webmd.com/cold-and-flu/fever"
        },
        cold: {
            keywords: {
                "en": ["cold", "running nose", "sneezing", "stuffy nose"],
                "es": ["resfriado", "nariz que moquea", "estornudos"],
                "hi": ["सर्दी", "बहती नाक", "छींक"],
                "ta": ["குளிர்", "நெற்றிக்கட்டு", "தும்மல்"]
            },
            questions: {
                "en": ["Do you have a runny nose?", "Are you experiencing sneezing?", "Do you feel congested?"],
                "es": ["¿Tienes la nariz que moquea?", "¿Estás estornudando?", "¿Te sientes congestionado?"],
                "hi": ["क्या आपकी नाक बह रही है?", "क्या आपको छींक आ रही है?", "क्या आपको भीड़भाड़ महसूस हो रही है?"],
                "ta": ["உங்கள் மூக்கு ஒழுகுகிறதா?", "நீங்கள் தும்முகிறீர்களா?", "நீங்கள் மூச்சுத்திணறல் உணர்கிறீர்களா?"]
            },
            medicine: {
                "en": "Antihistamines or decongestants.",
                "es": "Antihistamínicos o descongestionantes.",
                "hi": "एंटीहिस्टामिन या डीकॉन्जेस्टेंट्स।",
                "ta": "ஆன்டிஹிஸ்டமின்கள் அல்லது மூக்கழற்சி நிவாரணி."
            },
            advice: {
                "en": "Drink warm fluids, rest, and use steam inhalation.",
                "es": "Bebe líquidos calientes, descansa y usa inhalación de vapor.",
                "hi": "गर्म तरल पदार्थ पिएं, आराम करें और भाप लें।",
                "ta": "சூடான திரவங்களை குடிக்கவும், ஓய்வெடுக்கவும், நீராவி இழுக்கவும்."
            },
            link: "https://www.webmd.com/cold-and-flu/cold-guide"
        }
    };

    function saveHealthHistory(symptom) {
        let history = JSON.parse(localStorage.getItem("healthHistory")) || [];
        history.push({ date: new Date().toLocaleString(), symptom });
        localStorage.setItem("healthHistory", JSON.stringify(history));
    }

    function handleHealthQuery(message) {
        for (let symptom in symptoms) {
            for (let keyword of symptoms[symptom].keywords[userLanguage]) {
                if (message.includes(keyword)) {
                    currentSymptoms.push(symptom);
                    userAnswers[symptom] = [];
                    saveHealthHistory(symptom);
                }
            }
        }

        if (currentSymptoms.length > 0) {
            currentSymptomBeingProcessed = currentSymptoms[0];
            speak(symptoms[currentSymptoms[0]].questions[userLanguage][0]);
            return;
        }

        speak("I'm not sure about that. Please consult a medical professional.");
        medicalLink.href = "#";
    }

    function processUserResponse(message) {
        if (currentSymptomBeingProcessed) {
            let symptomData = symptoms[currentSymptomBeingProcessed];

            userAnswers[currentSymptomBeingProcessed].push(message);
            questionIndex++;

            if (questionIndex < symptomData.questions[userLanguage].length) {
                speak(symptomData.questions[userLanguage][questionIndex]);
            } else {
                speak(`${symptomData.advice[userLanguage]} ${symptomData.medicine[userLanguage]}`);
                medicalLink.href = symptomData.link;
                medicalLink.textContent = "Learn More";
                currentSymptomBeingProcessed = null;
            }
            return;
        }

        handleHealthQuery(message);
    }
});
