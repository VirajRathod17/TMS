/* eslint-disable react/jsx-no-target-blank */
import React , {useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {KTSVG} from '../../../helpers'
import {AsideMenuItem} from './AsideMenuItem'
import axios from 'axios';
import useFetchAwards from '../../../../app/modules/awards/components/fetchAwards';
import {fetchUserProfile} from '../../../../app/modules/auth/services/userProfileService';

export function AsideMenuMain() {
  const intl = useIntl()
  const { awards, setAwards} = useFetchAwards(); 
  const [selectedAwardId, setSelectedAwardId] = useState(''); 
  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const data = await fetchUserProfile();
        setSelectedAwardId(data.award_id);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAwards();
  });


const handleAwardChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedAwardId = event.target.value;
  
  if (selectedAwardId) {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await axios.post(
        process.env.REACT_APP_API_BASE_URL + 'change-award-year',
        { award_id: selectedAwardId }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
    } catch (error) {
      console.error('Error changing award year:', error);
    }
  }
};

  return (
    <>

      <div className="fv-plugins-icon-container mt-3 px-5">                             
          <select name="award_id" id="awards_id" className="form-select award_id" data-control="select2" onChange={handleAwardChange} value={selectedAwardId} >
                  {/* <option value={selectedAwardId}>Select Award</option> */}
                  {awards.map((award) => (
                     <option value={award.id} data-userid = "">  {award.name}</option>
                  ))}
          </select>
      </div>
      <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title='Dashboard'
        fontIcon='bi-app-indicator' 
      />
      <AsideMenuItem
        to='/awards'
        icon='/media/icons/duotune/art/art002.svg'
        title='Award'
        />
      <AsideMenuItem
        to='/award-category'
        icon='/media/icons/duotune/art/art002.svg'
        title='Award Category'
        fontIcon='bi-app-indicator'
      />
      {/* <AsideMenuItem
        to='/sponsers'
        icon='/media/icons/duotune/art/art002.svg'
        title='Sponsers'
        fontIcon='bi-app-indicator'
      /> */}
      <AsideMenuItem
        to='/supporting-association'
        icon='/media/icons/duotune/art/art002.svg'
        title='Supporting Association'
        fontIcon='bi-app-indicator'
      /> 
      <AsideMenuItem
        to='/media-partner'
        icon='/media/icons/duotune/art/art002.svg'
        title='Media Partner'
        fontIcon='bi-app-indicator'
      />
      {/* <AsideMenuItem
        to='/news'
        icon='/media/icons/duotune/art/art002.svg'
        title='News'
        fontIcon='bi-app-indicator'
      /> */}
    </>
  )
}
