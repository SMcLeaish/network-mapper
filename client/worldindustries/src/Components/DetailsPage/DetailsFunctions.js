import { TextField, MenuItem, Button } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export const renderNarrativeForm = (check) => {
    if (check) {
        return (
            <></>
        )
    }
}


export const renderAssociateForm = (check, handleSubmit, handleChangeForFormEntity, handleChangeForFormEvent, everyone, events, setAddAssociateToggle) => {
    if (check) {
        return (
            <div className='associate_form_container'>
                <form className='associate-form bg-jet' onSubmit={() => handleSubmit()}>
                    <TextField
                        required
                        id="id_entity_2"
                        select
                        label="Select"
                        helperText="Please select your associate"
                        defaultValue=''
                        onChange={(e) => handleChangeForFormEntity(e)}
                    >
                        {everyone.map(person => (
                            <MenuItem key={person.name} value={person.name}>
                                {person.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        required
                        id="id_event"
                        select
                        label="Select"
                        helperText="Please select the event"
                        defaultValue=''
                        onChange={(e) => handleChangeForFormEvent(e)}
                    >
                        {events.map(event => (
                            <MenuItem key={event.event_name} value={event}>
                                {event.event_name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <div>
                        <Button
                            variant="outlined"
                            startIcon={<AddCircleIcon />}
                            className='rounded-button'
                            type='submit'
                        >
                            Add Associate
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            className='rounded-button'
                            type='button'
                            onClick={() => setAddAssociateToggle(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        )
    }
}
