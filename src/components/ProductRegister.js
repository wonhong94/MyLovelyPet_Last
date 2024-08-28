import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ProductRegister.css';

const ProductRegister = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    mainCategory: '',
    subCategory: '',
    pdName: '',
    pdPrice: '',
    pdLimit: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const categoryMapping = {
    공통: {
      미용용품: 1,
      외출용품: 2,
      '급식/급수기': 3,
    },
    강아지: {
      사료: 4,
      간식: 5,
      장난감: 6,
      위생용품: 7,
    },
    고양이: {
      사료: 8,
      간식: 9,
      장난감: 10,
      위생용품: 11,
    },
  };

  const mainCategoryOptions = Object.keys(categoryMapping);

  const subCategoryOptions = formData.mainCategory
    ? Object.keys(categoryMapping[formData.mainCategory])
    : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'mainCategory') {
      setFormData((prevData) => ({
        ...prevData,
        mainCategory: value,
        subCategory: '',
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mainCategory || !formData.subCategory) {
      Swal.fire({
        icon: 'warning',
        title: '카테고리 선택 필요',
        text: '카테고리를 선택해주세요.',
      });
      return;
    }

    const userIdx = localStorage.getItem('userIdx');
    if (!userIdx) {
      Swal.fire({
        icon: 'error',
        title: '로그인 필요',
        text: '로그인이 필요합니다.',
      });
      return;
    }

    const ctgIdx = categoryMapping[formData.mainCategory][formData.subCategory];

    const productData = {
      ctgIdx: ctgIdx,
      pdName: formData.pdName,
      pdPrice: parseInt(formData.pdPrice, 10),
      pdLimit: parseInt(formData.pdLimit, 10),
      userIdx: parseInt(userIdx, 10),
    };

    const data = new FormData();
    data.append(
      'product',
      new Blob([JSON.stringify(productData)], { type: 'application/json' })
    );
    if (selectedImage) {
      data.append('file', selectedImage);
    }

    try {
      await axios.post('/petShop/product/save', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire({
        icon: 'success',
        title: '등록 성공',
        text: '상품이 성공적으로 등록되었습니다.',
      });
      closeModal();
    } catch (error) {
      console.error('상품 등록에 실패했습니다.', error);
      if (error.response) {
        console.error('서버 응답:', error.response.data);
        Swal.fire({
          icon: 'error',
          title: '등록 실패',
          text: `상품 등록에 실패했습니다: ${error.response.data.message || '서버 오류'}`,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '등록 실패',
          text: '상품 등록에 실패했습니다: 서버와의 연결에 문제가 있습니다.',
        });
      }
    }
  };

  const handleOverlayClick = (e) => {
    // e.stopPropagation()을 사용하여 오버레이 클릭을 무시합니다.
    e.stopPropagation();
  };

  return (
    <div className="product-modal-overlay" onClick={handleOverlayClick}>
      <div className="product-modal">
        <div className="modal-header">
          <h2>상품 등록</h2>
          <button className="close-button" onClick={closeModal}>
            &times;
          </button>
        </div>
        <div className="title-divider"></div>
        <form onSubmit={handleSubmit} className="product-register-form">
          <div className="form-section">
            <div className="form-group">
              <label>상위 카테고리:</label>
              <select
                name="mainCategory"
                value={formData.mainCategory}
                onChange={handleInputChange}
                required
              >
                <option value="">선택</option>
                {mainCategoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>하위 카테고리:</label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                required
                disabled={!formData.mainCategory}
              >
                <option value="">선택</option>
                {subCategoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>상품명:</label>
              <input
                type="text"
                name="pdName"
                value={formData.pdName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>상품 가격:</label>
              <input
                type="number"
                name="pdPrice"
                value={formData.pdPrice}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label>최소 수량:</label>
              <input
                type="number"
                name="pdLimit"
                value={formData.pdLimit}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
          
          </div>
          <div className="image-section">
            <div className="image-placeholder">
              {imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="상품 이미지" />
              ) : (
                '상품 이미지를 등록해주세요.'
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <div className="form-group">
              <button type="submit" className="submit-button">
                등록
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ProductRegister;