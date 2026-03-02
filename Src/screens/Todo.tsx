import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addTodo } from '../redux/todoSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

const Todo = () => {
    const dispatch = useDispatch(); 
    const todoList = useSelector((state) => state.todo.todos);
    const [description, setDescription] = React.useState('');

    console.log('Todo List from Redux:', todoList);
    const [todos, setTodos] = React.useState([]);
    const [input, setInput] = React.useState('');

    // const addTodo = () => {
    //     if (input.trim()) {
    //         setTodos([...todos, input]);
    //         setInput('');
    //     }
    // };   
    const renderItem=({ item }) => {
        console.log('Rendering item:', item.title);
        return (
        <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc',  }}>
    <Text style={{ fontSize: 18, margin: 5 ,color: 'black'}}>{item.title}</Text>
    <Text style={{ fontSize: 18, margin: 5 ,color: 'black'}}>{item.desc}</Text>
    </View>
        )
    }   
    // useEffect(() => {
    //     dispatch
    // }
    // , [todos])
  return (
    <SafeAreaView style={{ flex: 1 ,marginTop:50}}>
    <View style={{ justifyContent: 'center', alignItems: 'center' ,marginTop:50}}>
        <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Enter a title"
            style={{ borderWidth: 1, padding: 10, width: '80%', marginBottom: 10 }}
        />
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Enter a Description"
            style={{ borderWidth: 1, padding: 10, width: '80%', marginBottom: 10 }}
        />
        {/* <TouchableleOpacity onPress={() => dispatch(addTodo(input))}>
           
        </TouchableleOpacity>
        */}
        <TouchableOpacity onPress={() => dispatch(addTodo({title: input,desc:description}))} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5 }}  >
            <Text>Add Todo</Text>
        </TouchableOpacity>
    <View style={{  justifyContent: 'center', alignItems: 'center' }}>
      <Text>Todo List</Text>
      <FlatList
       data={todoList}
        keyExtractor={(item: any, index) => item.id ? item.id.toString() : index.toString()}        style={{ width: '100%' ,flex:1}}
        renderItem={renderItem}
        />
        </View>

    </View>
    </SafeAreaView>
  
  )
}

export default Todo

const styles = StyleSheet.create({})