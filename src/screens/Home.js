import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TextInput, FlatList } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../contexts'

export const HomeScreen = () => {
    const { user } = useContext(AuthContext)

    const [ text, setText ] = useState('')
    const [ messages, setMessage ] = useState([])

    useEffect(() => {
        const unsubscribe = firestore()
                .collection('messages')
                .orderBy('createdAt', 'desc')
                .onSnapshot((snapshot) => {

            const _messages = []
            snapshot.forEach((doc) => {
                _messages.push({ id: doc.id, ...doc.data() })
            })
            setMessage(_messages)
        })

        return unsubscribe
    }, [])

    const onSubmit = async () => {
        await firestore().collection('messages').add({
            text,
            user: user.phoneNumber,
            createdAt: new Date(),
        })
        setText('')
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <Text>Hello</Text>
                <FlatList
                    inverted
                    data={ messages }
                    keyExtractor={ ({ id }) => id }
                    renderItem={({ item }) => {
                        return (
                            <View style={{ flexDirection: 'row', height: 200 }}>
                                <Text style={{ flex: 1 }}>{ item.user }</Text>
                                <Text style={{ flex: 2 }}>{ item.text }</Text>
                            </View>
                        )
                    }}
                    />
            </View>
            <TextInput value={ text } onChangeText={ setText } onSubmitEditing={ onSubmit } />
        </View>
    )
}
