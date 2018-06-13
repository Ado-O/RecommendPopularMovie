import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Button } from 'react-native-elements'
import Deck from './Deck'

const image = 'https://image.tmdb.org/t/p/w185/'

class Api extends React.Component {
    state = {
        data: []
    }

    componentWillMount() {
        this.fetchData()
    }

    //carolija iza api requesta 
    fetchData = async () => {
        const response = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=c7720ac64a6580dc890bb503e5f55335&language=en-US&page=1")
        const json = await response.json()
        this.setState({ data: json.results })
    }


    renderCard(item) {
        return (
            <Card
                key={item.id}
                title={item.text}
                imageStyle = {{flex: 0, height: 350}}
                image={{ uri: image + item.poster_path }}
            >
                <Text style={{ marginBottom: 10 }}>
                    {item.title}
                </Text>
                <Button
                    icon={{ name: 'local-movies' }}
                    backgroundColor="#03A9F4"
                    title="Trailer"
                />
            </Card>
        )
    }

    //proces koji se desava nakon zadnje carde
    renderNoMoreCards() {
        return (
            <Card title="All Done!">
                <Text style={{ marginBottom: 10 }}>
                    There no more content here!
     </Text>
                <Button
                    backgroundColor="#03A9F4"
                    title="Get more!"
                />
            </Card>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Deck
                    data={this.state.data}
                    renderCard={this.renderCard}
                    renderNoMoreCards={this.renderNoMoreCards}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
});

export default Api