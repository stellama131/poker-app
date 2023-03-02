import { useState } from "react"
import hands from "./HandData"
import HandWidgets from "./HandWidgets"

function Hands() {

    // randomise hands
    function randomise(arr) {
        let currentIndex = arr.length,  randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex --;

            [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
        }
        return arr;
    }

    const [unselectedHands, setUnselectedHands] = useState(randomise(hands))
    const [selectedHands, setSelectedHands] = useState([])
    const [currentDragged, setCurrentDragged] = useState(null)
    const [modal, setModal] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    
    function toggleModal() {
        setModal(!modal)
    }

    function handleOnDropSelected() {
        // Stops user from draggin into the same area
        if(selectedHands.includes(currentDragged)) {
            return
        } else {
            setSelectedHands([...selectedHands, currentDragged])
        }

        let newUnselected = []
        for (let i = 0; i < unselectedHands.length; i++) {
            if (unselectedHands[i] !== currentDragged) {
                newUnselected.push(unselectedHands[i])
            }
        }
        setUnselectedHands(newUnselected)
    }

    function handleOnDropUnselected() {
        // Stops user from dragging into the same area
        if(unselectedHands.includes(currentDragged)) {
            return
        } else {
            setUnselectedHands([...unselectedHands, currentDragged])
        }

        let newSelected = []
        for (let i = 0; i < selectedHands.length; i++) {
            if (selectedHands[i] !== currentDragged) {
                newSelected.push(selectedHands[i])
            }

        }
        setSelectedHands(newSelected)
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function onDrag(hand) {
        setCurrentDragged(hand)
    }

    function handleSubmit() {

        if (selectedHands.length !== 10) {
            console.log("You're missing a few hand combos")
            setModalContent("You're missing a few hand combos")
            toggleModal()
        } else {
            let rankCounter = 10
            for (let i=0; i<selectedHands.length; i++) {
                if(selectedHands[i].ranking === rankCounter) {
                    rankCounter = rankCounter - 1
                    console.log(rankCounter)
                } else {
                    console.log("bad luck")
                    setModalContent("bad luck")
                    toggleModal()
                    return
                }
            }
            console.log(rankCounter)
            console.log("You won! Pokerstar!")
            setModalContent("You won! Pokerstar!")
            toggleModal()
        }
    }

    function handleReset() {
        setUnselectedHands(randomise(hands))
        setSelectedHands([])
        setModal(false)
        setModalContent(null)
    }
    // console.log(unselectedHands)
    // console.log(selectedHands)
    // console.log("current dragged is:", currentDragged)

    return (
        <div>
            <div className="gameArea">

            <div className="unselectedSection" onDrop={handleOnDropUnselected} onDragOver={handleDragOver}>
                <h3>Move these:</h3>
                <div className="widgets">
                    <HandWidgets key={hands} hands={unselectedHands} onDrag={onDrag}></HandWidgets>
                </div>

            </div>

            <div className="selectedSection" onDrop={handleOnDropSelected} onDragOver={handleDragOver}>
                <h3>To here:</h3>
                <div className="widgets">
                    <HandWidgets key={hands} hands={selectedHands} onDrag={onDrag}></HandWidgets>
                </div>

            </div>

            </div>
            <div className="submitSection">
                <input className="submitButton" type="submit" onClick={handleSubmit}></input>
                <button className="resetButton" onClick={handleReset}>Reset</button>
            </div>

            { modal &&
                (<div className="modal">
                <div className="overlay" onClick={toggleModal}>
                    <div className="modalContent">
                        <h2>Result</h2>
                        <div className="modalContent">
                            {modalContent}
                        </div>
                        <button className="closeButton" onClick={toggleModal}>CLOSE</button>
                    </div>
                </div>
                </div>)
            }


        </div>

    )
}

export default Hands
