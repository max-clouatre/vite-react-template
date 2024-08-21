import { useReducer, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { Button} from '@/components/ui/button';


import './App.css'
import { Form } from './components/ui/form';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

function ConnectionForm({ onAddConnection }) {
  const [name, setName] = useState('');
  const [persona, setPersona] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '' || persona.trim() === '') {
      return;
    }
    onAddConnection({ id: uuidv4(), name, persona });
    setName('');
    setPersona('');
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Persona"
        value={persona}
        onChange={(e) => setPersona(e.target.value)}
        placeholder="e.g., 5-year-old, grandmother"
        required
      />
      <Button type="submit" variant="primary">
        Add Connection
      </Button>
    </Form>
  );
}

function ConnectionList({ connections, onSelect, onRemove, onUpdate }) {
  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      {connections.length === 0 ? (
        <p className="text-gray-600">No connections yet. Add a connection to get started.</p>
      ) : (
        connections.map((connection, index) => (
          <Card key={index} className="hover:bg-gray-50">
            <CardHeader onClick={() => onSelect(index)} className="cursor-pointer">
              <CardTitle>{connection.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{connection.persona}</p>
              <div className="flex justify-end space-x-2">
                <Button variant="link" onClick={() => onUpdate(index, { ...connection, persona: "updated persona" })}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => onRemove(index)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function SubjectForm({ onGenerateExplanation }) {
  const [subject, setSubject] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subject.trim() === '') {
      return;
    }
    onGenerateExplanation(subject);
    setSubject('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
      >
        Generate Explanation
      </button>
    </form>
  );
}

function Explanation({ explanation }) {
  if (!explanation) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Explanation</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{explanation}</p>
      </CardContent>
    </Card>
  );
}

// Reducer function to manage connections
function connectionsReducer(state, action) {
  switch (action.type) {
    case "ADD_CONNECTION":
      return [...state, action.payload];
    case "REMOVE_CONNECTION":
      return state.filter((_, index) => index !== action.payload);
    case "UPDATE_CONNECTION":
      return state.map((connection, index) =>
        index === action.payload.index ? action.payload.newConnection : connection
      );
    default:
      return state;
  }
}

function App() {
  const [connections, dispatch] = useReducer(connectionsReducer, []);
  const [selectedConnectionIndex, setSelectedConnectionIndex] = useState(null);
  const [explanation, setExplanation] = useState("");

  const addConnection = (connection) => {
    dispatch({ type: "ADD_CONNECTION", payload: connection });
  };

  const removeConnection = (index) => {
    dispatch({ type: "REMOVE_CONNECTION", payload: index });
    if (selectedConnectionIndex === index) {
      setSelectedConnectionIndex(null);
      setExplanation("");
    }
  };

  const updateConnection = (index, newConnection) => {
    dispatch({ type: "UPDATE_CONNECTION", payload: { index, newConnection } });
  };

  const generateExplanation = async (subject) => {
    if (selectedConnectionIndex === null) return;

    const { name, persona } = connections[selectedConnectionIndex];

    // Simulate calling a generative AI service, like GPT-4
    const aiResponse = `Imagine explaining ${subject} to a ${persona}. Here's how I would do it...`;

    setExplanation(`Hey ${name}, ${aiResponse}`);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <div className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-xl font-semibold text-gray-800">Connections</h2>
        <ConnectionForm onAddConnection={addConnection} />
      </div>

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Matters</h1>
        <p className="mb-8 text-gray-600">
          Enter a subject to get a personalized explanation for your selected connection.
        </p>
        
        {selectedConnectionIndex !== null ? (
          <>
            <SubjectForm onGenerateExplanation={generateExplanation} />
            <Explanation explanation={explanation} />
          </>
        ) : (
          <p className="text-gray-600">Please select a connection from the sidebar to get started.</p>
        )}
      </div>

      <aside className="w-64 bg-white shadow-lg">
        <ConnectionList
          connections={connections}
          onSelect={setSelectedConnectionIndex}
          onRemove={removeConnection}
          onUpdate={updateConnection}
        />
      </aside>
    </div>
  );
}

export default App
