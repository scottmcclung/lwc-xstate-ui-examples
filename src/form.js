import {LightningElement, track} from 'lwc';
import { createMachine, interpret } from '@xstate/fsm';

const formMachine = createMachine({
        id:      'form',
        initial: 'rendering',
        context: {
            fields: []
        },
        states:  {
            rendering:  {
                on: {
                    rendered: {
                        target:  'idle',
                        actions: assign({
                            fields: (context, {fields}) => fields
                        })
                    }
                }
            },
            idle:       {
                on: {
                    change:    'dirty'
                }
            },
            dirty:      {
                on: {
                    submit: 'submitting'
                }
            },
            submitting: {
                entry: 'submit',
                on:    {
                    success: {
                        target:  'idle',
                        actions: 'resetForm'
                    },
                    error:   'dirty'
                }
            }
        }
    },
    {
        actions: {
            submit:    (context, {target}) => target.submit(),
            resetForm: ({fields}) => {
                fields.forEach(element => element.reset());
            }
        }
    });


const {send, subscribe} = interpret(toggleMachine).start();

export default class SimpleForm extends LightningElement {
    @track state = {};

    get hasRendered() {
        return !this.state.matches('rendering');
    }

    get isBusy() {
        return ['loading', 'submitting'].some(this.state.matches);
    }

    get isNotDirty() {
        return !this.state.matches('dirty');
    }

    handleEvent(e) {
        e.preventDefault();
        send(e);
    }

    connectedCallback() {
        this.subscription = subscribe((state) => this.state = state);
    }

    renderedCallback() {
        if (this.hasRendered) return;
        send({
            type:   "rendered",
            fields: this.template.querySelectorAll('lightning-input-field')
        });
    }

    disconnectedCallback() {
        this.subscription.unsubscribe();
    }



}