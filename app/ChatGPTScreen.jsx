import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function ChatGPTScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer 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`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4', // or 'gpt-3.5-turbo'
          messages: newMessages,
        }),
      });

      const data = await res.json();
      console.log('GPT Response:', JSON.stringify(data, null, 2));

      if (!res.ok || !data.choices || !data.choices[0]?.message) {
        Alert.alert('Error', data?.error?.message || 'Unexpected GPT response');
        return;
      }

      const botMessage = data.choices[0].message;
      setMessages([...newMessages, botMessage]);
    } catch (err) {
      console.error('Error calling GPT:', err);
      Alert.alert('Error', 'Failed to contact GPT. Check your internet or API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chat}>
        {messages.map((msg, index) => (
          <Text key={index} style={msg.role === 'user' ? styles.user : styles.bot}>
            {msg.role === 'user' ? 'You: ' : 'GPT: '}
            {msg.content}
          </Text>
        ))}
        {loading && <ActivityIndicator size="small" />}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type your message"
          style={styles.input}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  chat: { flex: 1, marginBottom: 10 },
  user: { textAlign: 'right', marginVertical: 4, color: 'blue' },
  bot: { textAlign: 'left', marginVertical: 4, color: 'black' },
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginRight: 10,
  },
});
