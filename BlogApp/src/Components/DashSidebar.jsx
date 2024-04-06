import React from "react";
import {Sidebar} from 'flowbite-react';
import {HiArrowSmRight, HiDocumentText, HiUser} from 'react-icons/hi';
import { Link, useLocation } from "react-router-dom";
import { useState , useEffect } from "react";
import {signOutUserSuccess} from '../redux/user/userSlice';
import {useDispatch,useSelector} from 'react-redux';

export default function DashSidebar(){
    const location =useLocation();
    const dispatch=useDispatch();
    const [tab,setTab] = useState('');
    const {currUser}=useSelector((state)=>state.user);
    async function handleSignOut() {
        try{
            const res=await fetch('/api/user/signout',{
                method:'POST'
            });
            let data=res.json();
            if(!res.ok){
                throw data.method;
            }
            else{
                dispatch(signOutUserSuccess());
                return;
            }
        }
        catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        let urlParams= new URLSearchParams(location.search);
        let tabFromUrl=urlParams.get('tab');
        if(tabFromUrl)setTab(tabFromUrl);
    })
   return(
    <Sidebar className=" w-full md:w-56">
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=Profile'>
                    <Sidebar.Item active={tab==='Profile'} icon={HiUser} label={currUser && currUser.isAdmin?('Admin'):('user')} labelColor="dark" as='div'>
                        Profile
                    </Sidebar.Item>
                </Link>
                {currUser.isAdmin && (
                    <Link to='/dashboard?tab=Posts'>
                     <Sidebar.Item active={tab==='Posts'} icon={HiDocumentText} labelColor="dark" as='div'>
                         Posts
                     </Sidebar.Item>
                    </Link>
                )}
                <Sidebar.Item icon={HiArrowSmRight}  labelColor="dark" onClick={handleSignOut}>
                    SignOut
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
   )
}
