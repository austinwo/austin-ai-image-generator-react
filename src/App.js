import { useState } from 'react'
import Modal from './component/Modal'

const App = () => {

  const [images, setImages] = useState(null)
  const [value, setValue] = useState(null)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const getImages = async () => {
    setImages(null)
    if (value === null) {
      setError('prompt must be provided!')
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch('http://localhost:8000/images', options)
      console.log(response)
      const data = await response.json()
      console.log(data)
      setImages(data)
    } catch (err) {
      console.error(err)
    }
  }

  const uploadImage = async (e) => {
    console.log(e.target.files[0])
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    setModalOpen(true)
    setSelectedImage(e.target.files[0])
    e.target.value = null

    try {
      const options = {
        method: 'POST',
        body:formData
      }
      const response = await fetch('http://localhost:8000/upload', options)
      console.log(response)
      const data = await response.json()
      console.log(data)
    } catch (err) {
      console.error(err)
    }
  }

  console.log(value)
  console.log('selectedImage', selectedImage)


  const generateVariations = async () => {
    setImages(null)
    if (selectedImage === null) {
      setError('Error: Must have an image')
      setModalOpen(false)
      return
    }
    try {
      const options = {
        method: 'POST'
      }
      const response = await fetch('http://localhost:8000/variations', options)
      const data = await response.json()
      console.log(data)
      setImages(data)
      setError(null)
      setModalOpen(false)
    } catch (err) {
      console.error(err)
    }
  }


  return (
    <div className='app'>
    <section className='search-section'>
      <p>Start with a detailed description
      </p>
      <div className='input-container'>
        <input
          placeholder='Tokyo skyline 3000 years in the future'
          onChange={e => setValue(e.target.value)}
        />
        <button onClick={getImages}>Generate</button>
      </div>
      <p className='extra-info'>Or,
        <span>
          <label htmlFor='files'> upload an image </label>
          <input onChange={uploadImage} id='files' accept='image/*' type='file' hidden/>
        </span>
        to edit.
      </p>
      {error && <p>{error}</p>}
      { modalOpen && <div className='overlay'>
          <Modal
            setModalOpen={setModalOpen}
            setSelectedImage={setSelectedImage}
            selectedImage={selectedImage}
            generateVariations={generateVariations}
          />
        </div>

      }

    </section>
    <section className='image-section'>
      {
        images?.map((image, _index) => (
          <img key={_index} src={image.url} alt={`Generated image of ${value}`}/>
        ))
      }
    </section>
    </div>
  );
}

export default App;
