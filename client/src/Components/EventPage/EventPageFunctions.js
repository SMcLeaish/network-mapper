import { TextField, MenuItem, Button, Chip } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export const returnEventDetails = (data) => {
    if (data.length > 0) {
        let name = data[0].event_name;
        let type = data[0].type;
        return (
            <>
                <Chip
                    label={name}
                />
                <Chip
                    label={type}
                />
            </>
        )
    }
}

export const returnAttendies = (data) => {
    if (data.length > 0) {
        data = data.slice(1)
        return data.map(e => {
            return (
                <Chip
                    key={e.primary_name}
                    label={e.primary_name}
                />
            )
        })
    }
}

export const returnNarratives = (data) => {
    return data.map((e) => {
        return (
            <Chip
                key={e.narr_id}
                label={`Date: ${e.date}:
                    ${e.narrative_string}`}
            />
        )
    })
}

const handleOnChangeAttendie = (e, obj, setObj) => {
    let name = e.target.value
    let valueToAdd = { ...obj }
    fetch(`http://localhost:3001/entity/${name}`)
        .then(res => res.json())
        .then(data => {
            valueToAdd[e.target.name] = data[0].primary_entity_id
            setObj(valueToAdd)
            console.log(valueToAdd)
        })
}

const handleOnSubmitAttendie = (e, obj, setUpdateStatus, updateStatus) => {
    e.preventDefault()
    let init = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    }
    fetch('http://localhost:3001/interaction', init)
        .then(res => res.json())
        .then(data => {alert(data.message); setUpdateStatus(!updateStatus)})
}

export const renderAttendieForm = (check, everyone, setCheckForAttendie, obj, setObj, setUpdateStatus, updateStatus) => {
    if (check) {
        return (
            <div className='associate_form_container'>
                <form className='associate-form bg-jet' onSubmit={(e) => handleOnSubmitAttendie(e, obj, setUpdateStatus, updateStatus)}>
                    <TextField
                        required
                        id="id_entity_1"
                        name='id_entity_1'
                        select
                        label="Select"
                        helperText="Please select the attendie"
                        defaultValue=''
                        onChange={(e) => handleOnChangeAttendie(e, obj, setObj)}
                    >
                        {everyone.map(entity => (
                            <MenuItem key={entity.name} value={entity.name}>
                                {entity.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        required
                        id="id_entity_2"
                        name='id_entity_2'
                        select
                        label="Select"
                        helperText="Who did they attend with?"
                        defaultValue=''
                        onChange={(e) => handleOnChangeAttendie(e, obj, setObj)}
                    >
                        {everyone.map(entity => (
                            <MenuItem key={entity.name} value={entity.name}>
                                {entity.name}
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
                            Add Attendies
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            className='rounded-button'
                            type='button'
                            onClick={() => setCheckForAttendie(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        )
    }
}

const handleChangeNarr = (e, narrToAdd, setNarrToAdd ) => {
    let obj = {...narrToAdd}
    let date = new Date();
    date = date.toISOString().slice(0, 10)
    obj[e.target.id] = e.target.value
    obj.date = date
    setNarrToAdd(obj)
}

const handleSubmitNarr = (e, narrToAdd, setUpdateStatus, updateStatus) => {
    e.preventDefault();
    let init = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(narrToAdd)
    } 
    fetch('http://localhost:3001/narrative', init)
        .then(res => res.json())
        .then(data => {console.log(data.message); setUpdateStatus(!updateStatus)})
}

export const renderNarrativeForm = (check, setCheckForNarr, narrToAdd, setNarrToAdd, setUpdateStatus, updateStatus) => {
    if (check) {
        return (
            <form className='associate-form bg-jet' onSubmit={(e) => handleSubmitNarr(e, narrToAdd, setUpdateStatus, updateStatus)}>
                <TextField
                    required
                    multiline
                    id="narrative_string"
                    label="Required"
                    defaultValue=""
                    placeholder='Enter your narrative'
                    autoComplete='off'
                    onChange={(e) => handleChangeNarr(e, narrToAdd, setNarrToAdd)}
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
                        onClick={() => setCheckForNarr(false)}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        )
    }
}