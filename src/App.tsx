import "./App.css";
import { useState } from "react";
import { generateId } from "./lib/generate-id";
import { createUseStore } from "./store/state-manager";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

const useTodoStore = createUseStore<Todo[]>([]);

function App() {
  const [todos, setTodos] = useTodoStore();
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "active" | "completed">(
    "all"
  );

  const completedTodos = todos.filter((todo) => todo.completed === true).length;

  const filteredTodos = todos.filter((todo) => {
    if (filterType === "active") {
      return !todo.completed;
    } else if (filterType === "completed") {
      return todo.completed;
    }
    return true;
  });

  const addTodo = () => {
    if (!newTodo.trim()) {
      return;
    }

    setTodos([...todos, { id: generateId(), text: newTodo, completed: false }]);
    setNewTodo("");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const changeTodo = (nextTodo: Todo) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === nextTodo.id) {
          return nextTodo;
        } else {
          return todo;
        }
      })
    );
  };

  const selectAll = () => {
    setTodos(todos.map((todo) => ({ ...todo, completed: true })));
  };

  const clearAll = () => {
    setTodos(todos.map((todo) => ({ ...todo, completed: false })));
  };

  return (
    <>
      <div className="container">
        <h1>TODOS</h1>
        <div className="input-group">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add new todo..."
          />
          <button onClick={addTodo}>Enter</button>
        </div>
        <div className="upper-panel">
          <button onClick={selectAll}>Select all</button>
          {completedTodos > 0 ? (
            <button onClick={clearAll} className="upper-panel__clear-btn">
              Clear completed {completedTodos}
            </button>
          ) : null}
        </div>
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
            >
              <div>
                <input
                  id={`checkbox-${todo.id}`}
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                {editingId === todo.id ? (
                  <input
                    value={todo.text}
                    onChange={(e) =>
                      changeTodo({ ...todo, text: e.target.value })
                    }
                  />
                ) : (
                  <label htmlFor={`checkbox-${todo.id}`}>{todo.text}</label>
                )}
              </div>
              <div className="todo-item__btns">
                <button
                  onClick={() =>
                    setEditingId(editingId === todo.id ? null : todo.id)
                  }
                >
                  Change todo
                </button>
                <button onClick={() => removeTodo(todo.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="bottom-panel">
          <p>
            {todos.filter((todo) => todo.completed === false).length} item left
          </p>
          <div className="filters">
            <button
              className={filterType === "all" ? "active" : ""}
              onClick={() => setFilterType("all")}
            >
              All
            </button>
            <button
              className={filterType === "active" ? "active" : ""}
              onClick={() => setFilterType("active")}
            >
              Active
            </button>
            <button
              className={filterType === "completed" ? "active" : ""}
              onClick={() => setFilterType("completed")}
            >
              Completed
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
