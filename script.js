
        // Configuration object
        const defaultConfig = {
            main_title: "IdealMetric - Pengukur BMI Profesional",
            subtitle: "Hitung BMI Anda dengan akurat dan cepat",
            welcome_text: "Selamat datang di kalkulator BMI profesional yang akan membantu Anda memahami status kesehatan tubuh dengan lebih baik.",
            form_title: "Masukkan Data Anda",
            cta_button_text: "Mulai Hitung BMI",
            background_color: "#1e3a8a",
            surface_color: "#ffffff",
            text_color: "#1f2937",
            primary_action_color: "#10b981",
            secondary_action_color: "#6b7280"
        };

        // Global variables
        let currentPage = 1;
        let selectedGender = '';

        // Initialize SDKs
        async function initializeApp() {

            // Initialize Element SDK
            if (window.elementSdk) {
                await window.elementSdk.init({
                    defaultConfig,
                    onConfigChange: async (config) => {
                        // Update header content
                        document.getElementById('mainTitle').textContent = config.main_title || defaultConfig.main_title;
                        document.getElementById('subtitle').textContent = config.subtitle || defaultConfig.subtitle;
                        
                        // Update page content
                        document.getElementById('welcomeText').textContent = config.welcome_text || defaultConfig.welcome_text;
                        document.getElementById('formTitle').textContent = config.form_title || defaultConfig.form_title;
                        document.getElementById('ctaButtonText').textContent = config.cta_button_text || defaultConfig.cta_button_text;
                        
                        // Update colors
                        const backgroundColor = config.background_color || defaultConfig.background_color;
                        const surfaceColor = config.surface_color || defaultConfig.surface_color;
                        const textColor = config.text_color || defaultConfig.text_color;
                        const primaryActionColor = config.primary_action_color || defaultConfig.primary_action_color;
                        const secondaryActionColor = config.secondary_action_color || defaultConfig.secondary_action_color;
                        
                        document.body.style.background = `linear-gradient(135deg, ${backgroundColor} 0%, #3b82f6 100%)`;
                        document.body.style.color = textColor;
                        
                        // Update surface colors
                        const surfaces = document.querySelectorAll('.header, .page');
                        surfaces.forEach(surface => {
                            surface.style.backgroundColor = surfaceColor;
                        });
                        
                        // Update primary action buttons
                        const primaryButtons = document.querySelectorAll('.cta-button, .calculate-button');
                        primaryButtons.forEach(button => {
                            button.style.background = `linear-gradient(135deg, ${primaryActionColor} 0%, #059669 100%)`;
                        });
                        
                        // Update secondary action buttons
                        const secondaryButtons = document.querySelectorAll('.secondary-button');
                        secondaryButtons.forEach(button => {
                            button.style.backgroundColor = secondaryActionColor;
                        });
                    },
                    mapToCapabilities: (config) => ({
                        recolorables: [
                            {
                                get: () => config.background_color || defaultConfig.background_color,
                                set: (value) => {
                                    if (window.elementSdk) {
                                        window.elementSdk.setConfig({ background_color: value });
                                    }
                                }
                            },
                            {
                                get: () => config.surface_color || defaultConfig.surface_color,
                                set: (value) => {
                                    if (window.elementSdk) {
                                        window.elementSdk.setConfig({ surface_color: value });
                                    }
                                }
                            },
                            {
                                get: () => config.text_color || defaultConfig.text_color,
                                set: (value) => {
                                    if (window.elementSdk) {
                                        window.elementSdk.setConfig({ text_color: value });
                                    }
                                }
                            },
                            {
                                get: () => config.primary_action_color || defaultConfig.primary_action_color,
                                set: (value) => {
                                    if (window.elementSdk) {
                                        window.elementSdk.setConfig({ primary_action_color: value });
                                    }
                                }
                            },
                            {
                                get: () => config.secondary_action_color || defaultConfig.secondary_action_color,
                                set: (value) => {
                                    if (window.elementSdk) {
                                        window.elementSdk.setConfig({ secondary_action_color: value });
                                    }
                                }
                            }
                        ],
                        borderables: [],
                        fontEditable: undefined,
                        fontSizeable: undefined
                    }),
                    mapToEditPanelValues: (config) => new Map([
                        ["main_title", config.main_title || defaultConfig.main_title],
                        ["subtitle", config.subtitle || defaultConfig.subtitle],
                        ["welcome_text", config.welcome_text || defaultConfig.welcome_text],
                        ["form_title", config.form_title || defaultConfig.form_title],
                        ["cta_button_text", config.cta_button_text || defaultConfig.cta_button_text]
                    ])
                });
            }
        }

        // Page navigation
        function showPage(pageNumber) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show selected page
            document.getElementById(`page${pageNumber}`).classList.add('active');
            
            // Update navigation buttons
            document.querySelectorAll('.nav-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const navButtons = document.querySelectorAll('.nav-button');
            if (pageNumber === 1) navButtons[0].classList.add('active');
            else if (pageNumber === 2) navButtons[1].classList.add('active');
            else if (pageNumber === 4) navButtons[2].classList.add('active');
            
            currentPage = pageNumber;
        }

        // Gender selection
        document.querySelectorAll('.gender-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.gender-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
                selectedGender = this.dataset.gender;
                document.getElementById('gender').value = selectedGender;
            });
        });

        // BMI calculation
        function calculateBMI(weight, height) {
            const heightInMeters = height / 100;
            return weight / (heightInMeters * heightInMeters);
        }

        function getBMICategory(bmi) {
            if (bmi < 18.5) return 'Kurus';
            if (bmi < 25) return 'Normal';
            if (bmi < 30) return 'Gemuk';
            return 'Obesitas';
        }

        function getBMIInterpretation(category) {
            const interpretations = {
                'Kurus': 'BMI Anda di bawah normal. Disarankan untuk meningkatkan asupan nutrisi dan berkonsultasi dengan dokter.',
                'Normal': 'BMI Anda berada dalam kategori normal. Pertahankan pola hidup sehat!',
                'Gemuk': 'BMI Anda di atas normal. Disarankan untuk mengurangi berat badan dengan diet seimbang dan olahraga.',
                'Obesitas': 'BMI Anda menunjukkan obesitas. Sangat disarankan untuk berkonsultasi dengan dokter dan ahli gizi.'
            };
            return interpretations[category] || '';
        }

        function getHealthSuggestions(category) {
            const suggestions = {
                'Kurus': [
                    {
                        icon: '🍽️',
                        title: 'Tingkatkan Asupan Kalori',
                        text: 'Konsumsi makanan bergizi tinggi kalori seperti kacang-kacangan, alpukat, dan protein berkualitas.'
                    },
                    {
                        icon: '💪',
                        title: 'Latihan Kekuatan',
                        text: 'Fokus pada latihan beban untuk membangun massa otot dan meningkatkan berat badan sehat.'
                    },
                    {
                        icon: '🥛',
                        title: 'Konsumsi Protein',
                        text: 'Minum susu, smoothie protein, atau suplemen untuk mendukung pertambahan berat badan.'
                    },
                    {
                        icon: '👨‍⚕️',
                        title: 'Konsultasi Dokter',
                        text: 'Periksakan diri ke dokter untuk memastikan tidak ada masalah kesehatan yang mendasari.'
                    }
                ],
                'Normal': [
                    {
                        icon: '🥗',
                        title: 'Pola Makan Seimbang',
                        text: 'Pertahankan diet seimbang dengan sayuran, buah-buahan, protein, dan karbohidrat kompleks.'
                    },
                    {
                        icon: '🏃‍♂️',
                        title: 'Olahraga Teratur',
                        text: 'Lakukan aktivitas fisik minimal 150 menit per minggu untuk menjaga kebugaran.'
                    },
                    {
                        icon: '💧',
                        title: 'Hidrasi Cukup',
                        text: 'Minum air putih 8-10 gelas per hari untuk menjaga metabolisme tubuh tetap optimal.'
                    },
                    {
                        icon: '😴',
                        title: 'Tidur Berkualitas',
                        text: 'Tidur 7-9 jam per malam untuk mendukung pemulihan dan menjaga berat badan ideal.'
                    }
                ],
                'Gemuk': [
                    {
                        icon: '🍎',
                        title: 'Kurangi Kalori',
                        text: 'Batasi asupan kalori harian dan pilih makanan rendah kalori tinggi serat seperti buah dan sayur.'
                    },
                    {
                        icon: '🚶‍♀️',
                        title: 'Cardio Rutin',
                        text: 'Lakukan olahraga kardio seperti jalan cepat, jogging, atau bersepeda minimal 30 menit setiap hari.'
                    },
                    {
                        icon: '🚫',
                        title: 'Hindari Makanan Olahan',
                        text: 'Kurangi konsumsi makanan cepat saji, minuman manis, dan camilan tinggi gula.'
                    },
                    {
                        icon: '📊',
                        title: 'Monitor Progress',
                        text: 'Catat berat badan dan ukur lingkar pinggang secara rutin untuk memantau kemajuan.'
                    }
                ],
                'Obesitas': [
                    {
                        icon: '👩‍⚕️',
                        title: 'Konsultasi Ahli',
                        text: 'Segera konsultasi dengan dokter dan ahli gizi untuk program penurunan berat badan yang aman.'
                    },
                    {
                        icon: '🥬',
                        title: 'Diet Ketat Terkontrol',
                        text: 'Ikuti program diet yang diawasi profesional dengan fokus pada makanan rendah kalori tinggi nutrisi.'
                    },
                    {
                        icon: '🏊‍♂️',
                        title: 'Olahraga Bertahap',
                        text: 'Mulai dengan aktivitas ringan seperti berenang atau yoga, tingkatkan intensitas secara bertahap.'
                    },
                    {
                        icon: '🧠',
                        title: 'Dukungan Mental',
                        text: 'Pertimbangkan konseling atau bergabung dengan grup dukungan untuk menjaga motivasi.'
                    }
                ]
            };
            
            return suggestions[category] || suggestions['Normal'];
        }

        function getBMISilhouette(category, gender) {
            const silhouettes = {
                'Kurus': {
                    'male': `<svg width="80" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- Thin male silhouette -->
                        <ellipse cx="40" cy="15" rx="8" ry="10" fill="#374151"/>
                        <rect x="36" y="25" width="8" height="35" rx="2" fill="#374151"/>
                        <rect x="32" y="30" width="6" height="20" rx="2" fill="#374151"/>
                        <rect x="42" y="30" width="6" height="20" rx="2" fill="#374151"/>
                        <rect x="37" y="60" width="6" height="30" rx="2" fill="#374151"/>
                        <rect x="35" y="90" width="4" height="25" rx="2" fill="#374151"/>
                        <rect x="41" y="90" width="4" height="25" rx="2" fill="#374151"/>
                    </svg>`,
                    'female': `<svg width="80" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- Thin female silhouette -->
                        <ellipse cx="40" cy="15" rx="8" ry="10" fill="#374151"/>
                        <rect x="36" y="25" width="8" height="25" rx="2" fill="#374151"/>
                        <rect x="34" y="50" width="12" height="15" rx="3" fill="#374151"/>
                        <rect x="32" y="30" width="6" height="18" rx="2" fill="#374151"/>
                        <rect x="42" y="30" width="6" height="18" rx="2" fill="#374151"/>
                        <rect x="37" y="65" width="6" height="25" rx="2" fill="#374151"/>
                        <rect x="35" y="90" width="4" height="25" rx="2" fill="#374151"/>
                        <rect x="41" y="90" width="4" height="25" rx="2" fill="#374151"/>
                    </svg>`
                },
                'Normal': {
                    'male': `<svg width="80" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- Normal male silhouette -->
                        <ellipse cx="40" cy="15" rx="10" ry="12" fill="#059669"/>
                        <rect x="32" y="27" width="16" height="38" rx="3" fill="#059669"/>
                        <rect x="26" y="32" width="8" height="22" rx="3" fill="#059669"/>
                        <rect x="46" y="32" width="8" height="22" rx="3" fill="#059669"/>
                        <rect x="34" y="65" width="12" height="30" rx="3" fill="#059669"/>
                        <rect x="30" y="95" width="8" height="20" rx="3" fill="#059669"/>
                        <rect x="42" y="95" width="8" height="20" rx="3" fill="#059669"/>
                    </svg>`,
                    'female': `<svg width="80" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- Normal female silhouette -->
                        <ellipse cx="40" cy="15" rx="10" ry="12" fill="#059669"/>
                        <rect x="32" y="27" width="16" height="28" rx="3" fill="#059669"/>
                        <rect x="28" y="55" width="24" height="18" rx="5" fill="#059669"/>
                        <rect x="26" y="32" width="8" height="20" rx="3" fill="#059669"/>
                        <rect x="46" y="32" width="8" height="20" rx="3" fill="#059669"/>
                        <rect x="34" y="73" width="12" height="25" rx="3" fill="#059669"/>
                        <rect x="30" y="98" width="8" height="17" rx="3" fill="#059669"/>
                        <rect x="42" y="98" width="8" height="17" rx="3" fill="#059669"/>
                    </svg>`
                },
                'Gemuk': {
                    'male': `<svg width="80" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- Overweight male silhouette -->
                        <ellipse cx="40" cy="15" rx="12" ry="14" fill="#d97706"/>
                        <rect x="28" y="29" width="24" height="40" rx="5" fill="#d97706"/>
                        <rect x="22" y="34" width="10" height="24" rx="4" fill="#d97706"/>
                        <rect x="48" y="34" width="10" height="24" rx="4" fill="#d97706"/>
                        <rect x="30" y="69" width="20" height="28" rx="4" fill="#d97706"/>
                        <rect x="26" y="97" width="12" height="18" rx="4" fill="#d97706"/>
                        <rect x="42" y="97" width="12" height="18" rx="4" fill="#d97706"/>
                    </svg>`,
                    'female': `<svg width="80" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- Overweight female silhouette -->
                        <ellipse cx="40" cy="15" rx="12" ry="14" fill="#d97706"/>
                        <rect x="28" y="29" width="24" height="30" rx="5" fill="#d97706"/>
                        <rect x="24" y="59" width="32" height="20" rx="6" fill="#d97706"/>
                        <rect x="22" y="34" width="10" height="22" rx="4" fill="#d97706"/>
                        <rect x="48" y="34" width="10" height="22" rx="4" fill="#d97706"/>
                        <rect x="30" y="79" width="20" height="23" rx="4" fill="#d97706"/>
                        <rect x="26" y="102" width="12" height="13" rx="4" fill="#d97706"/>
                        <rect x="42" y="102" width="12" height="13" rx="4" fill="#d97706"/>
                    </svg>`
                },
                'Obesitas': {
                    'male': `<svg width="80" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- Obese male silhouette -->
                        <ellipse cx="40" cy="15" rx="14" ry="16" fill="#dc2626"/>
                        <rect x="24" y="31" width="32" height="42" rx="8" fill="#dc2626"/>
                        <rect x="18" y="36" width="12" height="26" rx="5" fill="#dc2626"/>
                        <rect x="50" y="36" width="12" height="26" rx="5" fill="#dc2626"/>
                        <rect x="26" y="73" width="28" height="25" rx="6" fill="#dc2626"/>
                        <rect x="22" y="98" width="16" height="17" rx="5" fill="#dc2626"/>
                        <rect x="42" y="98" width="16" height="17" rx="5" fill="#dc2626"/>
                    </svg>`,
                    'female': `<svg width="80" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- Obese female silhouette -->
                        <ellipse cx="40" cy="15" rx="14" ry="16" fill="#dc2626"/>
                        <rect x="24" y="31" width="32" height="32" rx="8" fill="#dc2626"/>
                        <rect x="20" y="63" width="40" height="22" rx="8" fill="#dc2626"/>
                        <rect x="18" y="36" width="12" height="24" rx="5" fill="#dc2626"/>
                        <rect x="50" y="36" width="12" height="24" rx="5" fill="#dc2626"/>
                        <rect x="26" y="85" width="28" height="20" rx="6" fill="#dc2626"/>
                        <rect x="22" y="105" width="16" height="10" rx="5" fill="#dc2626"/>
                        <rect x="42" y="105" width="16" height="10" rx="5" fill="#dc2626"/>
                    </svg>`
                }
            };
            
            return silhouettes[category] && silhouettes[category][gender] 
                ? silhouettes[category][gender] 
                : silhouettes['Normal']['male'];
        }

        // Form submission
        document.getElementById('bmiForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const age = parseInt(document.getElementById('age').value);
            const height = parseFloat(document.getElementById('height').value);
            const weight = parseFloat(document.getElementById('weight').value);
            
            // Validation
            if (!age || !selectedGender || !height || !weight) {
                showError('Mohon lengkapi semua data yang diperlukan.');
                return;
            }
            
            if (age < 1 || age > 120) {
                showError('Usia harus antara 1-120 tahun.');
                return;
            }
            
            if (height < 50 || height > 250) {
                showError('Tinggi badan harus antara 50-250 cm.');
                return;
            }
            
            if (weight < 10 || weight > 500) {
                showError('Berat badan harus antara 10-500 kg.');
                return;
            }


            
            // Show loading state
            const calculateButton = document.getElementById('calculateButton');
            const originalText = calculateButton.textContent;
            calculateButton.textContent = 'Menghitung...';
            calculateButton.disabled = true;
            
            try {
                // Calculate BMI
                const bmi = calculateBMI(weight, height);
                const category = getBMICategory(bmi);
                const interpretation = getBMIInterpretation(category);
                const silhouette = getBMISilhouette(category, selectedGender);

                
                // Display results
                document.getElementById('bmiSilhouette').innerHTML = silhouette;
                document.getElementById('bmiValue').textContent = (Math.round(bmi * 10) / 10).toFixed(1);
                document.getElementById('bmiCategory').textContent = category;
                document.getElementById('bmiInterpretation').textContent = interpretation;
                
                // Update BMI chart indicator
                updateBMIIndicator(bmi);
                
                // Display health suggestions
                const suggestions = getHealthSuggestions(category);
                const suggestionsGrid = document.getElementById('suggestionsGrid');
                suggestionsGrid.innerHTML = '';
                
                suggestions.forEach(suggestion => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'suggestion-item';
                    suggestionItem.innerHTML = `
                        <div class="suggestion-icon">${suggestion.icon}</div>
                        <div class="suggestion-content">
                            <div class="suggestion-title">${suggestion.title}</div>
                            <div class="suggestion-text">${suggestion.text}</div>
                        </div>
                    `;
                    suggestionsGrid.appendChild(suggestionItem);
                });
                
                // Update BMI display color based on category
                const bmiDisplay = document.querySelector('.bmi-display');
                const bmiValue = document.querySelector('.bmi-value');
                
                if (category === 'Normal') {
                    bmiDisplay.style.background = 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)';
                    bmiDisplay.style.borderColor = '#10b981';
                    bmiValue.style.color = '#059669';
                } else if (category === 'Kurus') {
                    bmiDisplay.style.background = 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
                    bmiDisplay.style.borderColor = '#f59e0b';
                    bmiValue.style.color = '#d97706';
                } else {
                    bmiDisplay.style.background = 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)';
                    bmiDisplay.style.borderColor = '#ef4444';
                    bmiValue.style.color = '#dc2626';
                }
                
                showSuccess('BMI berhasil dihitung!');
                
                // Reset form
                document.getElementById('bmiForm').reset();
                selectedGender = '';
                document.querySelectorAll('.gender-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Show results page
                setTimeout(() => {
                    showPage(3);
                }, 1500);
                
            } catch (error) {
                showError('Terjadi kesalahan saat menghitung BMI. Silakan coba lagi.');
            } finally {
                // Reset button
                calculateButton.textContent = originalText;
                calculateButton.disabled = false;
            }
        });





        // Update BMI chart indicator position
        function updateBMIIndicator(bmi) {
            const indicator = document.getElementById('userIndicator');
            const indicatorValue = document.getElementById('indicatorValue');
            
            // Update indicator value
            indicatorValue.textContent = (Math.round(bmi * 10) / 10).toFixed(1);
            
            // Calculate position based on BMI value
            let position = 0;
            
            if (bmi < 18.5) {
                // Underweight section (0% to 46.25% of total width)
                position = (bmi / 18.5) * 46.25;
            } else if (bmi < 25) {
                // Normal section (46.25% to 62.25% of total width)
                position = 46.25 + ((bmi - 18.5) / 6.5) * 16;
            } else if (bmi < 30) {
                // Overweight section (62.25% to 74.5% of total width)
                position = 62.25 + ((bmi - 25) / 5) * 12.25;
            } else {
                // Obese section (74.5% to 100% of total width)
                position = 74.5 + Math.min(((bmi - 30) / 10) * 25.5, 25.5);
            }
            
            // Ensure position stays within bounds
            position = Math.max(5, Math.min(95, position));
            
            // Apply position
            indicator.style.left = position + '%';
            
            // Add highlight effect to corresponding bar section
            const sections = document.querySelectorAll('.bar-section');
            sections.forEach(section => section.classList.remove('highlighted'));
            
            if (bmi < 18.5) {
                sections[0].classList.add('highlighted');
            } else if (bmi < 25) {
                sections[1].classList.add('highlighted');
            } else if (bmi < 30) {
                sections[2].classList.add('highlighted');
            } else {
                sections[3].classList.add('highlighted');
            }
        }

        // Utility functions
        function showError(message) {
            const errorDiv = document.getElementById('errorMessage');
            const successDiv = document.getElementById('successMessage');
            
            successDiv.style.display = 'none';
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }

        function showSuccess(message) {
            const errorDiv = document.getElementById('errorMessage');
            const successDiv = document.getElementById('successMessage');
            
            errorDiv.style.display = 'none';
            successDiv.textContent = message;
            successDiv.style.display = 'block';
            
            setTimeout(() => {
                successDiv.style.display = 'none';
            }, 3000);
        }

        // Initialize app when page loads
        document.addEventListener('DOMContentLoaded', initializeApp);
    (function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'99fd3cace0b8b5b1',t:'MTc2MzM2MTYzMC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();