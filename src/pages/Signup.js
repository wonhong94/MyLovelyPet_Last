import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import FaceCapture from './facecapture';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    name: '',
    phone1: '010',
    phone2: '',
    phone3: '',
    emailUser: '',
    emailDomain: 'naver.com',
    customDomain: '',
    businessNumber: '',
    businessStartDate: '',
    storeName: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [businessVerified, setBusinessVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [faceImage, setFaceImage] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [passwordValid, setPasswordValid] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationModal, setVerificationModal] = useState(false);
  const [isCustomDomain, setIsCustomDomain] = useState(false);

  const navigate = useNavigate();
  const faceRecognitionButtonRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'emailDomain') {
      setIsCustomDomain(value === '직접입력');
    }

    if (name === 'password') {
      const password = value;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      const isValidLength = password.length >= 8 && password.length <= 16;
      const validConditions = [hasUpperCase || hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;

      if (!isValidLength || validConditions < 2) {
        setPasswordValid('비밀번호는 영문 대소문자, 숫자, 특수문자 중 2가지 이상을 포함하여 8자에서 16자로 입력해야 합니다.');
      } else {
        setPasswordValid('');
      }
    }

    if (name === 'confirmPassword') {
      if (formData.password !== value) {
        setPasswordError('비밀번호가 일치하지 않습니다.');
      } else {
        setPasswordError('');
      }
    }
  };

  const verifyBusinessNumber = async () => {
    try {
      const requestData = {
        businesses: [
          {
            b_no: formData.businessNumber,
            start_dt: formData.businessStartDate.replace(/-/g, ''),
            p_nm: formData.name,
            p_nm2: "",
            b_nm: "",
            corp_no: "",
            b_sector: "",
            b_type: "",
            b_adr: ""
          }
        ]
      };

      const response = await axios.post('/api/petShop/user/business', requestData);

      const businessData = response.data.data[0];

      if (businessData.valid !== "02" && businessData.status.b_stt === "계속사업자") {
        Swal.fire({
          icon: 'success',
          title: '사업자 인증 성공',
          text: '사업자 번호가 인증되었습니다.',
        });
        setBusinessVerified(true);
      } else if (businessData.valid === "02") {
        Swal.fire({
          icon: 'error',
          title: '사업자 인증 실패',
          text: '유효하지 않은 사업자 번호입니다. 다시 확인해주세요.',
        });
        setBusinessVerified(false);
      } else if (businessData.status.b_stt !== "계속사업자") {
        Swal.fire({
          icon: 'error',
          title: '사업자 인증 실패',
          text: '해당 사업자는 계속사업자가 아닙니다. 다시 확인해주세요.',
        });
        setBusinessVerified(false);
      }
    } catch (error) {
      console.error('사업자 번호 인증 실패:', error);
      Swal.fire({
        icon: 'error',
        title: '사업자 인증 실패',
        text: '사업자 번호 인증에 실패했습니다. 다시 시도해 주세요.',
      });
    }
  };

  const handleEmailVerification = async () => {
    const email = `${formData.emailUser}@${isCustomDomain ? formData.customDomain : formData.emailDomain}`;
    
    try {
      await axios.get(`/api/petShop/user/sendEmailCode/${email}`);
      setVerificationModal(true);
    } catch (error) {
      console.error('이메일 인증 요청 실패:', error);
      Swal.fire({
        icon: 'error',
        title: '이메일 인증 실패',
        text: '이메일 인증 요청에 실패했습니다. 다시 시도해 주세요.',
      });
    }
  };

  const handleVerificationSubmit = async () => {
    const email = `${formData.emailUser}@${isCustomDomain ? formData.customDomain : formData.emailDomain}`;
  
    try {
      const response = await axios.get(`/api/petShop/user/verifyEmailCode/${email}/${encodeURIComponent(String(verificationCode))}`);
  
      console.log('서버 응답:', response.data);
  
      if (response.data === '성공')  {
        Swal.fire({
          icon: 'success',
          title: '이메일 인증 성공',
          text: '이메일 인증이 완료되었습니다.',
        });
        setEmailVerified('성공');
        setVerificationModal(false);
      } else if (response.data === '실패') {
        Swal.fire({
          icon: 'error',
          title: '이메일 인증 실패',
          text: '인증 코드가 올바르지 않습니다. 다시 확인해 주세요.',
        });
      }
    } catch (error) {
      console.error('이메일 인증 실패:', error);
      Swal.fire({
        icon: 'error',
        title: '이메일 인증 실패',
        text: '이메일 인증에 실패했습니다. 다시 시도해 주세요.',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      Swal.fire({
        icon: 'warning',
        title: '이메일 인증 필요',
        text: '이메일을 인증해 주세요.',
      });
      return;
    }

    if (!businessVerified) {
      Swal.fire({
        icon: 'warning',
        title: '사업자 인증 필요',
        text: '사업자 번호를 인증해 주세요.',
      });
      return;
    }

    if (passwordError || passwordValid) {
      Swal.fire({
        icon: 'warning',
        title: '비밀번호 확인 필요',
        text: '비밀번호를 확인해 주세요.',
      });
      return;
    }

    const email = `${formData.emailUser}@${isCustomDomain ? formData.customDomain : formData.emailDomain}`;

    const userData = {
      userPhone: `${formData.phone1}-${formData.phone2}-${formData.phone3}`,
      userEmail: email,
      userPw: formData.password,
      userBN: formData.businessNumber,
      userName: formData.name,
      userStoreName: formData.storeName,
    };

    console.log("전송 데이터:", userData);

    try {
      const response = await axios.post('/api/petShop/user/userSave', userData);
      console.log('회원가입 성공:', response.data);

      if (faceImage) {
        await axios.post(`/api/petShop/collectionFaceAdd/${encodeURIComponent(formData.businessNumber)}`, { image: faceImage });
        console.log("얼굴 이미지 전송 완료");
      }

      Swal.fire({
        icon: 'success',
        title: '회원가입 성공',
        text: '회원가입이 성공적으로 완료되었습니다.',
      });
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);

      if (error.response && error.response.data) {
        console.error('서버 응답:', error.response.data);
      }

      Swal.fire({
        icon: 'error',
        title: '회원가입 실패',
        text: '회원가입에 실패했습니다. 다시 시도해 주세요.',
      });
    }
  };

  const handleImageCapture = (image) => {
    setFaceImage(image);
    setShowModal(false);
  };

  return (
    <div className="signup-container">
      <h2>JOIN</h2>
      <div className="title-divider"></div>
      <h3>아래 회원가입 양식을 입력해주세요.</h3>
      <div className="title-divider"></div>
      <form onSubmit={handleSubmit} className="signup-form">
        {/* 폼 필드들 */}
        <div className="signup-form-group">
          <label>이름 *</label>
          <div className="signup-input-wrapper">
            <input type="text" name="name" placeholder="이름" value={formData.name} onChange={handleChange} />
          </div>
        </div>
        <div className="input-divider"></div>

        <div className="signup-form-group">
          <label>사업등록 날짜 *</label>
          <div className="signup-input-wrapper">
            <input 
              type="date" 
              name="businessStartDate" 
              placeholder="YYYY-MM-DD" 
              value={formData.businessStartDate} 
              onChange={handleChange} 
              required 
              disabled={businessVerified} 
            />
            <small>사업등록 날짜를 입력하세요.</small>
          </div>
        </div>
        <div className="input-divider"></div>

        <div className="signup-form-group">
          <label>사업자 번호</label>
          <div className="signup-input-wrapper">
            <div className="input-row">
              <input 
                type="text" 
                name="businessNumber" 
                placeholder="사업자 번호" 
                value={formData.businessNumber} 
                onChange={handleChange} 
                disabled={businessVerified} 
              />
              <button 
                type="button" 
                onClick={verifyBusinessNumber} 
                disabled={businessVerified} 
                style={{ marginLeft: '10px' }}
              >
                인증
              </button>
            </div>
          </div>
        </div>
        <div className="input-divider"></div>

        <div className="signup-form-group">
          <label>이메일 *</label>
          <div className="signup-input-wrapper">
            <div className="input-row">
              <input
                type="text"
                name="emailUser"
                placeholder="user"
                value={formData.emailUser}
                onChange={handleChange}
                style={{ width: '120px' }} 
              />
              @
              {isCustomDomain && (
                <input
                  type="text"
                  name="customDomain"
                  placeholder="직접 입력"
                  value={formData.customDomain}
                  onChange={handleChange}
                  style={{ width: '150px', marginLeft: '5px' }} 
                />
              )}
              <select
                name="emailDomain"
                value={formData.emailDomain}
                onChange={handleChange}
                style={{ width: '150px', marginLeft: '5px' }} 
              >
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="hanmail.net">hanmail.net</option>
                <option value="직접입력">직접입력</option>
              </select>
              <button type="button" onClick={handleEmailVerification} style={{ marginLeft: '10px' }}>
                인증
              </button>
            </div>
          </div>
        </div>
        <div className="input-divider"></div>

        <div className="signup-form-group">
          <label>비밀번호 *</label>
          <div className="signup-input-wrapper">
            <div className="password-container input-row">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="Password" 
                value={formData.password} 
                onChange={handleChange} 
              />
              <span 
                className="toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ marginLeft: '10px' }}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            {passwordValid && <small className="error-message">{passwordValid}</small>}
            <small>(영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 8자~16자)</small>
          </div>
        </div>
        <div className="input-divider"></div>

        <div className="signup-form-group">
          <label>비밀번호 확인 *</label>
          <div className="signup-input-wrapper">
            <div className="password-container input-row">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                name="confirmPassword" 
                placeholder="Confirm Password" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
              />
              <span 
                className="toggle-password" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ marginLeft: '10px' }}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </span>
            </div>
            {passwordError && <small className="error-message">{passwordError}</small>}
          </div>
        </div>
        <div className="input-divider"></div>
        <div className="signup-form-group">
          <label>전화번호 *</label>
          <div className="signup-input-wrapper">
            <div className="phone-container input-row">
              <input
                type="text"
                name="phone1"
                placeholder="010"
                value={formData.phone1}
                onChange={handleChange}
                maxLength="3"
                style={{ width: '60px' }} 
              />
              -
              <input
                type="text"
                name="phone2"
                placeholder="0000"
                value={formData.phone2}
                onChange={handleChange}
                maxLength="4"
                style={{ width: '80px', marginLeft: '5px' }} 
              />
              -
              <input
                type="text"
                name="phone3"
                placeholder="0000"
                value={formData.phone3}
                onChange={handleChange}
                maxLength="4"
                style={{ width: '80px', marginLeft: '5px' }} 
              />
            </div>
          </div>
        </div>
        <div className="input-divider"></div>

        <div className="signup-form-group">
          <label>매장명</label>
          <div className="signup-input-wrapper">
            <input type="text" name="storeName" placeholder="매장명" value={formData.storeName} onChange={handleChange} />
          </div>
        </div>
        <div className="input-divider"></div>

        <div className="signup-form-group">
          <label>안면 인식</label>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            ref={faceRecognitionButtonRef}
          >
            안면 인식
          </button>
        </div>

        <div className="form-actions">
          <button type="submit">Sign Up</button>
          <button type="button" onClick={() => navigate('/login')}>BACK</button>
        </div>
      </form>

      {/* 얼굴 인식 모달 창 */}
     {showModal && (
  <div className="modal-face-recognition">
    <div className="modal-content">
      <span className="close" onClick={() => setShowModal(false)}>&times;</span>
      <FaceCapture onImageCapture={handleImageCapture} size="large" showCaptureButton={true} />
    </div>
  </div>
)}


      {/* 이메일 인증 모달 창 */}
      {verificationModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setVerificationModal(false)}>&times;</span>
            <h3>이메일 인증</h3>
            <p>이메일로 전송된 인증번호를 입력하세요.</p>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="인증번호 입력"
            />
            <button onClick={handleVerificationSubmit}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;