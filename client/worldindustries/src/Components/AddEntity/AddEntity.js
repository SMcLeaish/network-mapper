import { useState } from 'react';
import './AddEntity.css';

//  ADD ENTITY - PARENT FUNCTION
const AddEntity = () => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [narrative, setNarrative] = useState('');
    const [organization, setOrganization] = useState('');
    const [association, setAssociation] = useState('');
    const [events, setEvents] = useState('');

    //  UPLOAD PHOTO - CHILD FUNCTION
    const profilePictureUpload = (event) => {
        const file = event.target.files[0];
        setProfilePicture(file);
    };

    //  SET ORGANIZATION - CHILD FUNCTION
    const settingOrganization = (event) => {
        const { value } = event.target;
        setOrganization(value);
    };

    //  SET ASSOCIATION - CHILD FUNCTION
    const settingAssociation = (event) => {
        const { value } = event.target;
        setAssociation(value);
    };

    //  SET EVENTS - CHILD FUNCTION
    const settingEvents = (event) => {
        const { value } = event.target;
        setEvents(value);
    };

    //  SET NARRATIVE - CHILD FUNCTION
    const SettingNarrative = () => {
        
        //  NARRATIVE UPDATE - GRANDCHILD FUNCTION
        const narrativeUpdate = (event) => {
            const { value } = event.target;
            setNarrative(value);
        };
        const maxCharacters = 500;
        const remainingCharacters = maxCharacters - narrative.length;
        
        return (
            <div>
                <textarea value={narrative} onChange={narrativeUpdate} maxLength={maxCharacters} />
                <div>
                    {remainingCharacters}/{maxCharacters}
                </div>
            </div>
        )
    }

    return (
        <div>
            <header>
                <h1>
                    Add Entity
                </h1>
            </header>

            <div>
                <h2>
                    Upload a Profile Picture
                </h2>
                {profilePicture ? (
                    <img src={URL.createObjectURL(profilePicture)} alt='ProfilePicture' />
                    ) : (
                    <p>
                        No photo uploaded
                    </p>
                )}
                <input type='file' accept='image/*' onChange={profilePictureUpload} />
            </div>
            <div>
                <h3>
                    Organization:
                </h3>
                <input type='text' value={organization} onChange={settingOrganization} />
            </div>
            <div>
                <h3>
                    Association:
                </h3>
                <input type='text' value={association} onChange={settingAssociation} />
            </div>
            <div>
                <h3>
                    Events:
                </h3>
                <input type='text' value={events} onChange={settingEvents} />
            </div>
            <div>
                <h3>
                    Narrative:
                </h3>
                <SettingNarrative />
            </div>
            <button onClick={AddEntity}>
                Save
            </button>
        </div>

    )
}

export default AddEntity;
