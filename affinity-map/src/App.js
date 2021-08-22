import React, { useState, useReducer } from 'react';
import { v4 as uuid } from 'uuid';
import Draggable from 'react-draggable';
import { MapInteractionCSS } from 'react-map-interaction';

const initialNoteState = {
  lastNoteCreated: null,
  totalNotes: 0,
  notes: [],
}

const notesReducer = (prevState, action) => {
  switch (action.type) {
    case 'ADD_NOTE': {
      const newState = {
        lastNoteCreated: new Date().toTimeString().slice(0, 8),
        totalNotes: prevState.notes.length + 1,
        notes: [...prevState.notes, action.payload]
      }
      console.log(newState);
      return newState;
    }
    case 'DELETE_NOTE': {
      const newState = {
        ...prevState,
        totalNotes: prevState.notes.length - 1,
        notes: prevState.notes.filter(note => note.id !== action.payload.id)
      }
      console.log(newState);
      return newState;
    }
    case 'UPDATE_NOTE': {
      const updatedNote = prevState.notes.find(note => note.id === action.payload.id)
      updatedNote.text = action.payload.text
      const newState = {
        ...prevState,
        totalNotes: prevState.notes.length,
        notes: prevState.notes
      }
      console.log(newState);
      return newState;
    }
  }
}

const App = () => {
  const [noteInput, setNoteInput] = useState('');
  const [groupInput, setGroupInput] = useState('1');
  const [sort, setSort] = useState(false);
  const [noteState, dispatch] = useReducer(notesReducer, initialNoteState);

  const addNote = (event) => {
    event.preventDefault();
    console.log(groupInput)
    if (!noteInput) {
      window.alert('Enter some text!')
      return;
    }
    const newNote = {
      id: uuid(),
      text: noteInput,
      group: groupInput,
    }
    dispatch({ type: 'ADD_NOTE', payload: newNote })
    setNoteInput('');
  }

  const editText = (note, event) => {
    event.preventDefault()
    console.log(event)
    console.log(note)
    note.text = event.target.textContent
    dispatch({ type: 'UPDATE_NOTE', payload: note })
  }

  const pickColor = (note) => {
    switch (note.group) {
      case '1': {
        return "bg-yellow-400";
      }
      case '2': {
        return "bg-red-400";
      }
      case '3': {
        return "bg-blue-400";
      }
      case '4': {
        return "bg-green-400";
      }
    }
  }

  const callSort = (event) => {
    event.preventDefault();
    setSort(!sort)
    if (sort === true) {
      event.target.innerText = "Unsort"
    } else {
      event.target.innerText = "Sort"
    }
  }

  return (
    <div className="bg-gray-300 h-full w-full">
      <div className="w-screen border-4 border-black rounded-lg sticky top-0">
        <h1 className="font-serif text-3xl bg-red-400 flex justify-center items-center">
          Affinity Map
        </h1>
      </div>
      <div>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={event => callSort(event)}>
          Sort
        </button>
      </div>
      <div className="mt-10 border-4 border-black bg-red-600 w-min rounded-lg h-60">
        <form onSubmit={addNote} className=" w-min">
          <textarea
            className="bg-green-200 h-40"
            value={noteInput}
            onChange={event => setNoteInput(event.target.value)}
            placeholder="Add a Note">
          </textarea>
          <label>Select Group: </label>
          <select required="true" onChange={event => setGroupInput(event.target.value)}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <div className="border-2 border-black rounded-lg w-10 mt-2">
            <button className="flex justify-center items-center">Add</button>
          </div>
        </form>
      </div>
      <div className="mt-10">
        {sort === true ? (
          <>
            {noteState
              .notes
              .map(note => {
                return (
                  <Draggable>
                    <div id="id1" className={`flex border-2 border-black rounded-lg ${pickColor(note)} w-40 h-40`} key={note.id}>
                      <div onClick={() => dispatch({ type: 'DELETE_NOTE', payload: note })} className="w-5 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="overscroll-auto overflow-y-scroll h-28 w-28 ml-2" contenteditable="true" onInput={(event) => { editText(note, event) }}>
                        {note.text}
                      </div>
                    </div>
                  </Draggable>
                )
              })}
          </>
        ) : (
          <>
            {
              <div className="flex flex-row space-x-40 w-full h-full">
                <div className="border-black border-2 rounded-lg w-1/5">
                  <h1 className="underline mb-10">Group 1</h1>
                  {noteState
                   .notes
                   .filter(note => note.group === "1")
                   .map(note => {
                    return (
                      <Draggable>
                        <div id="id1" className={`flex border-2 border-black rounded-lg ${pickColor(note)} w-40 h-40 mb-2`} key={note.id}>
                          <div onClick={() => dispatch({ type: 'DELETE_NOTE', payload: note })} className="w-5 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="overscroll-auto overflow-y-scroll h-28 w-28 ml-2" contenteditable="true" onInput={(event) => { editText(note, event) }}>
                            {note.text}
                          </div>
                        </div>
                      </Draggable>
                    )
                  })
                  }
                </div>
                <div className="border-black border-2 rounded-lg w-1/5">
                  <h1 className="underline mb-10">Group 2</h1>
                  {noteState
                   .notes
                   .filter(note => note.group === "2")
                   .map(note => {
                    return (
                      <Draggable>
                        <div id="id1" className={`flex border-2 border-black rounded-lg ${pickColor(note)} w-40 h-40 mb-2`} key={note.id}>
                          <div onClick={() => dispatch({ type: 'DELETE_NOTE', payload: note })} className="w-5 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="overscroll-auto overflow-y-scroll h-28 w-28 ml-2" contenteditable="true" onInput={(event) => { editText(note, event) }}>
                            {note.text}
                          </div>
                        </div>
                      </Draggable>
                    )
                  })
                  }
                </div>
                <div className="border-black border-2 rounded-lg w-1/5">
                  <h1 className="underline mb-10">Group 3</h1>
                  {noteState
                   .notes
                   .filter(note => note.group === "3")
                   .map(note => {
                    return (
                      <Draggable>
                        <div id="id1" className={`flex border-2 border-black rounded-lg ${pickColor(note)} w-40 h-40 mb-2`} key={note.id}>
                          <div onClick={() => dispatch({ type: 'DELETE_NOTE', payload: note })} className="w-5 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="overscroll-auto overflow-y-scroll h-28 w-28 ml-2" contenteditable="true" onInput={(event) => { editText(note, event) }}>
                            {note.text}
                          </div>
                        </div>
                      </Draggable>
                    )
                  })
                  }
                </div>
                <div className="border-black border-2 rounded-lg w-1/5">
                  <h1 className="underline mb-10">Group 4</h1>
                  {noteState
                   .notes
                   .filter(note => note.group === "4")
                   .map(note => {
                    return (
                      <Draggable>
                        <div id="id1" className={`flex border-2 border-black rounded-lg ${pickColor(note)} w-40 h-40 mb-2`} key={note.id}>
                          <div onClick={() => dispatch({ type: 'DELETE_NOTE', payload: note })} className="w-5 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="overscroll-auto overflow-y-scroll h-28 w-28 ml-2" contenteditable="true" onInput={(event) => { editText(note, event) }}>
                            {note.text}
                          </div>
                        </div>
                      </Draggable>
                    )
                  })
                  }
                </div>
              </div>
            }
          </>
        )
        }
      </div>
    </div>
  );
}

export default App;