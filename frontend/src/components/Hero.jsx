import React, { useState, useRef, useEffect } from 'react';
import { MdOutlineFileUpload } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import logo from '../assets/Loading_icon.gif';

export default function Hero() {
    const [content, setContent] = useState("");
    const [previewURL, setPreviewURL] = useState("");
    const [image, setImage] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    async function apiData() {
        try {
            setLoading(true); // show loader

            const formData = new FormData();
            formData.append("content", content);
            if (image) {
                formData.append("image", image);
            }else{
                alert("image is required")
                return
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}ask`, {
                method: 'POST',
                body: formData
            });
            // console.log(response);

            const result = await response.json();
            
            setData(result.result);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); // always stop loader
        }
    }

    const handleChange=(e)=>{
         const file = e.target.files[0];
         console.log(file);
         
        setImage(file);

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            
            
            setPreviewURL(objectUrl);
        }
    }

    useEffect(() => {
        return () => {
            if (previewURL) {
            URL.revokeObjectURL(previewURL);
            }
        };
    }, [previewURL]);

    const submitForm = (e) => {
        e.preventDefault();
        apiData();

        // reset states
        setContent("");
        setImage(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    return (
        <div className='main'> 
           
            <div className="hero-section">
            <div id='header'>
                 <h2 id='heading'>Know about your image with AI <img className='infinity' src="./Infinity GIF - Infinity - Discover & Share GIFs.gif" alt="infinity-logo" /></h2>
            </div>

            <form onSubmit={submitForm}>
                { previewURL?
                <img src={previewURL}  className="preview " alt="preview image" />
                :
                <label htmlFor="image" title='upload' className='image'><MdOutlineFileUpload /></label>
                }<br/><br />
                <input 
                    type="file" 
                    id="image" 
                    name="image"  
                    accept="image/*"
                    capture="environment" 
                    ref={fileInputRef}
                    onChange={handleChange} 
                     hidden
                     
                />
               
                    <textarea  
                        name="content"
                        cols={40}
                        rows={5}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter your content here..." 
                        required
                    ></textarea><br /><br />
              
                <button type="submit" >Add</button>
            </form>
                   {/* Loader or Result */}
           
        </div>
        
         {loading ? (
                
                    <div id='logo1'>
                        <img src={logo} alt='logo' id='logo' />
                    </div>
            
            ) : (
                data && <ReactMarkdown >{data}</ReactMarkdown>
            )}
         
        </div>
    );
}
