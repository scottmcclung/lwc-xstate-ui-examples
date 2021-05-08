import {LightningElement, track} from 'lwc';
import { createMachine, interpret } from '@xstate/fsm';

// The object provided to the machine follows the  
const toggleMachine = createMachine({
    id:      'toggle',
    initial: 'inactive',
    states:  {
        inactive: {on: {click: 'active'}},
        active:   {on: {click: 'inactive'}}
    }
});

const {send, subscribe} = interpret(toggleMachine).start();

export default class Toggle extends LightningElement {
    @track state = {};

    get isActive() {
        return this.state.matches('active');
    }

    get buttonText() {
      return `Click to toggle ${this.state.matches('active') ? 'Off' : 'On'}`;
    }

    get buttonClasses() {
      return `slds-button slds-button_${this.state.matches('active') ? 'neutral' : 'brand'}`
    }

    handleClick(e) {
        send(e);
    }

    connectedCallback() {
        this.subscription = subscribe((state) => this.state = state);
    }

    disconnectedCallback() {
        this.subscription.unsubscribe();
    }
}
