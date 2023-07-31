import { TextField, MenuItem, Button, Chip } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export const renderNarrativeForm = (check, setAddNarrToggle) => {
    if (check) {
        return (
            <form className='associate-form bg-jet'>
                <TextField
                    required
                    multiline
                    id="narrative_string"
                    label="Required"
                    defaultValue=""
                    placeholder='Enter your narrative'
                    autoComplete='off'
                />
                <div>
                    <Button
                        variant="outlined"
                        startIcon={<AddCircleIcon />}
                        className='rounded-button'
                        type='submit'
                    >
                        Add Narrative
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        className='rounded-button'
                        type='button'
                        onClick={() => setAddNarrToggle(false)}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        )
    }
}

export const returnChipsForAssociates = (data, handleClickAssociate, handleDeleteAssociate) => {
    return data.map((e) => {
        return (
            <Chip
                key={e.entity_id}
                label={e.name}
                onClick={() => handleClickAssociate(e.entity_id)}
                onDelete={() => handleDeleteAssociate(e.entity_id)}
            />
        )
    })
}

export const returnNarratives = (data) => {
    return data.map((e) => {
        return (
            <Chip
                key={e.id}
                label={e.narrative_string}
            />
        )
    })
}

export const returnEvents = (data) => {
    let events = data.map(e => e.event_name)
    let unique = [...new Set(events)]
    return unique.map((e) => {
        return (
            <Chip
                key={e}
                label={e}
            />
        )
    })
}

export const returnBiography = (data) => {
    if (data.length > 0) {
        let bio = data[0]
        if (bio.individual_id) {
            return (
                <>
                    <Chip key={bio.individual_name}
                        label={`Name: ${bio.individual_name}`}
                    />
                    <Chip key={bio.position_id}
                        label={`Works for ${bio.org_name}`}
                    />
                </>
            )
        } else {
            return (
                <>
                    <Chip key={bio.individual_name}
                        label={`Organization name: ${bio.name}`}
                    />
                    <Chip key={bio.position_id}
                        label={`Organization type: ${bio.type}`}
                    />
                </>
            )
        }
    }
}


export const renderAssociateForm = (check, handleSubmit, handleChangeForFormEntity, handleChangeForFormEvent, everyone, events, setAddAssociateToggle) => {
    if (check) {
        return (
            <div className='associate_form_container'>
                <form className='associate-form bg-jet' onSubmit={(e) => handleSubmit(e)}>
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
