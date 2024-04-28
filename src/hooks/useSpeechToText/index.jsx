import React, {useEffect, useState, useRef} from "react";

const useSpeechToText = (options) => {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")
    const recgonitionRef = useRef(null)

    useEffect(() => {
        if(!('webkitSpeechRecognition' in window)) {
            console.error('web speech api is not supported')
            return;
        } 

        recgonitionRef.current = new window.webkitSpeechRecognition()
        const recognition = recgonitionRef.current
        recognition.interimResults = options.interimResults || true 
        recognition.lang = options.lang || "en-US"
        recognition.continuous = options.continuous || false

        // if ("webkitSpeechGrammarList" in window) {
        //     const grammar = "#JSGF V1.0 grammar punctuatin; public <punc> = . | , | ? | ! | ; | : ;"
        //     const SpeechRecognitionList = new window.webkitSpeechGrammarList()
        //     SpeechRecognitionList.addFormString(grammar, 1)
        //     recognition.grammars = SpeechRecognitionList
        // }

        recognition.onresult = (event) => {
            let text = ""
            for(let i = 0; i < event.results.length; i ++) {
                text += event.results[i][0].transcript 
            }
            setTranscript(text)
        }

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error)
        }

        recognition.onend = () => {
            setIsListening(false)
            setTranscript("")
        }

        return () => {
            recognition.stop()
        }
    }, [])

    const startListening = () => {
        if(recgonitionRef.current && !isListening) {
            recgonitionRef.current.start()
            setIsListening(true)
        }
    }

    const stopListening = () => {
        if(recgonitionRef.current && isListening) {
            recgonitionRef.current.stop()
            setIsListening(false)
        }
    }

    return {
        isListening,
        transcript,
        startListening,
        stopListening
    }
}

export default useSpeechToText