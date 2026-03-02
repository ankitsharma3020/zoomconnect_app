import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface TodoState {
    todos: string[];
}

const initialState: TodoState = {
    todos: [],
};

const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<string>) => {
            state.todos.push(action.payload);
        },
        removeTodo: (state, action: PayloadAction<number>) => {
            state.todos.splice(action.payload, 1);
        },
        editTodo: (state, action: PayloadAction<{ index: number; newTodo: string }>) => {
            const { index, newTodo } = action.payload;
            if (index >= 0 && index < state.todos.length) {
                state.todos[index] = newTodo;
            }
        }
    },
});

export const { addTodo, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;   