import React, { Component } from 'react'
import {
    View,
    Animated,
    PanResponder,
    Dimensions,
    LayoutAnimation,
    UIManager
} from 'react-native'

//vraca width od screen-a
const SCREEN_WIDTH = Dimensions.get('window').width
//minimalna razlika koju korisnik treba da rotira card-u
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH
//izraz koji koristiomo u milisekunde
const SWIPE_OUT_DURATION = 250

class Deck extends Component {
    static defaultProps = {
        onSwipeRight: () => { },
        onSwipeLeft: () => { }
    }

    constructor(props) {
        super(props)

        //position hvata gesture i stavlja u animated
        const position = new Animated.ValueXY()
        const panResponder = PanResponder.create({
            //kada korisnik pritisne na ekran
            onStartShouldSetPanResponder: () => true,
            //kada korisnik pomjera sa prstom po ekranom
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy })
            },
            //kada korisnik pritisne ili pomjera i onda pusti
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right')
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left')
                } else {
                    this.resetPosition()
                }
            }
        })

        this.state = { panResponder, position, index: 0 }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({ index: 0 })
        }
    }

    componentWillUpdate() {
        //kod za android simulator
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
        LayoutAnimation.spring()
    }

    //dio animacije kada kartu dovoljno rotiramo ona povlaci iz slike
    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
        Animated.timing(this.state.position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction))
    }

    //proces koji se desava kada povuces card do kraja ekrana
    onSwipeComplete(direction) {
        const { onSwipeLeft, onSwipeRight, data } = this.props
        const item = data[this.state.index]

        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item)
        this.state.position.setValue({ x: 0, y: 0 })
        this.setState({ index: this.state.index + 1 })
    }

    //vrsi restart card-e koja se vraca na poziciju nakon rotacije
    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: 0 }
        }).start()
    }

    getCardStyle() {
        const { position } = this.state
        //vrsi rotate card za 45 stepeni
        //interpolate - umetnuti
        const rotate = position.x.interpolate({
            //uzimas screen width svakog devic-a posebno 
            //* 1.5 smanjujes preveliku rotaciju
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg']
        })

        return {
            ...position.getLayout(),
            transform: [{ rotate }]
        }
    }

    renderCards() {
        //proces koji se desava nakon zadnje carde
        if (this.state.index >= this.props.data.length) {
            return this.props.renderNoMoreCards()
        }

        //izbacuje carde 
        return this.props.data.map((item, i) => {
            if (i < this.state.index) { return null }

            if (i === this.state.index) {
                return (
                    //nacin spajanja animated + panResponder
                    <Animated.View
                        key={item.id}
                        style={[this.getCardStyle(), styles.cardStyle]}
                        {...this.state.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                )
            }

            return (
                <Animated.View
                    key={item.id}
                    style={[styles.cardStyle, { top: 10 * (i - this.state.index) }]}
                >
                    {this.props.renderCard(item)}
                </Animated.View>
            )
            //preokrene da prva carda dolazi a a ne zadnja
        }).reverse()
    }

    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        )
    }
}

const styles = {
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH
    }
}

export default Deck