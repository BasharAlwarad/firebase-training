import './App.css';
import { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from './firebase';
import { v4 } from 'uuid';

function App() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageUrl, setImageUrl] = useState('');

  const imagesListRef = ref(storage, 'images/');

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      console.log(snapshot?.ref._location.path_);
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    return () => {
      const getImage = async () => {
        const singleImageRef = ref(
          storage,
          'images/wbs-bashar-shara.jpeg6124a034-ec02-4d05-9004-c350b80ca019'
        );
        await getDownloadURL(singleImageRef).then((res) => {
          setImageUrl(res);
        });
      };

      getImage();

      listAll(imagesListRef).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setImageUrls((prev) => [...prev, url]);
          });
        });
      });
    };
  }, []);

  return (
    <div className='App'>
      {imageUrl && <img alt={'i'} src={imageUrl} />}
      something
      <input
        type='file'
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <button onClick={uploadFile}> Upload Image</button>
      <div>{/* <img alt={'i'} src={imageUrl} /> */}</div>
      {imageUrls.map((url, i) => {
        return <img key={i} alt={i} src={url} />;
      })}
    </div>
  );
}

export default App;
