import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ArrowLeft, 
  RotateCcw, 
  Check, 
  Sparkles, 
  ShoppingBag, 
  CheckCircle2, 
  User, 
  Droplets, 
  Trees, 
  Flame, 
  Flower2, 
  Heart, 
  Leaf, 
  Sun, 
  Shield, 
  Briefcase, 
  Crown, 
  Moon, 
  Feather, 
  Compass,
  ArrowRight
} from 'lucide-react';

export const QUESTIONS = [
  {
    id: 'gender',
    title: 'Who is this fragrance for?',
    subtitle: 'Select the collection that best matches the wearer.',
    teaser: 'Next, what kind of scent character do you love most?',
    isMulti: false,
    gridCols: 'repeat(auto-fit, minmax(220px, 1fr))',
    options: [
      {
        id: 'men',
        label: "Men's Collection",
        desc: 'Bold, fresh, and confident perfumes for men',
        icon: User,
        gender: 'Men'
      },
      {
        id: 'women',
        label: "Women's Collection",
        desc: 'Elegant, sweet, and floral perfumes for women',
        icon: Sparkles,
        gender: 'Women'
      },
      {
        id: 'unisex',
        label: 'Shared & Unisex',
        desc: 'Unique and versatile niche perfumes',
        icon: Compass,
        gender: 'Unisex'
      }
    ]
  },
  {
    id: 'character',
    title: 'What kind of scent character do you love most?',
    subtitle: 'Choose one or more that you feel drawn to.',
    teaser: 'Next, where will you wear it?',
    isMulti: true,
    gridCols: 'repeat(auto-fit, minmax(160px, 1fr))',
    options: [
      {
        id: 'fresh',
        label: 'Fresh',
        desc: 'Citrus, Aquatic, Clean',
        icon: Droplets,
        traits: ['Fresh', 'Citrus', 'Aquatic', 'Clean', 'Marine', 'Bergamot']
      },
      {
        id: 'woody',
        label: 'Woody',
        desc: 'Earthy, Warm, Sophisticated',
        icon: Trees,
        traits: ['Woody', 'Cedar', 'Sandalwood', 'Vetiver', 'Earthy', 'Patchouli']
      },
      {
        id: 'oriental',
        label: 'Oriental',
        desc: 'Rich, Spicy, Exotic',
        icon: Flame,
        traits: ['Oriental', 'Spicy', 'Exotic', 'Warm', 'Resinous', 'Oud', 'Incense']
      },
      {
        id: 'floral',
        label: 'Floral',
        desc: 'Soft, Romantic, Feminine',
        icon: Flower2,
        traits: ['Floral', 'Rose', 'Jasmine', 'Peony', 'White Floral', 'Romantic Floral']
      },
      {
        id: 'sweet',
        label: 'Sweet',
        desc: 'Vanilla, Gourmand, Cozy',
        icon: Heart,
        traits: ['Sweet', 'Vanilla', 'Gourmand', 'Tonka', 'Caramel', 'Praline']
      },
      {
        id: 'aromatic',
        label: 'Aromatic',
        desc: 'Herbal, Green, Refined',
        icon: Leaf,
        traits: ['Aromatic', 'Lavender', 'Herbal', 'Green', 'Mint', 'Sage']
      },
      {
        id: 'amber',
        label: 'Amber',
        desc: 'Warm, Resinous, Sensual',
        icon: Sun,
        traits: ['Amber', 'Warm', 'Sensual', 'Resinous', 'Golden', 'Amberwood']
      },
      {
        id: 'leather',
        label: 'Leather',
        desc: 'Bold, Smoky, Powerful',
        icon: Shield,
        traits: ['Leather', 'Smoky', 'Tobacco', 'Bold', 'Dark', 'Suede']
      }
    ]
  },
  {
    id: 'occasion',
    title: 'Where will you wear your signature scent?',
    subtitle: 'Select the primary scenario or setting.',
    teaser: 'Next, how strong do you want your fragrance to project?',
    isMulti: false,
    gridCols: 'repeat(auto-fit, minmax(200px, 1fr))',
    options: [
      {
        id: 'daily',
        label: 'Daily & Office',
        desc: 'Clean, professional, and effortless for everyday wear',
        icon: Briefcase,
        occasionTag: 'Daily'
      },
      {
        id: 'date_night',
        label: 'Date Night & Romance',
        desc: 'Intimate, magnetic, and seductive close-range appeal',
        icon: Heart,
        occasionTag: 'Romantic'
      },
      {
        id: 'evening',
        label: 'Evening & Grand Events',
        desc: 'High-impact, opulent, and commanding presence',
        icon: Crown,
        occasionTag: 'Evening'
      },
      {
        id: 'versatile',
        label: 'Everywhere & Anytime',
        desc: 'A versatile chameleon that shines in any setting',
        icon: Sparkles,
        occasionTag: 'Versatile'
      }
    ]
  },
  {
    id: 'sillage',
    title: 'How do you want your fragrance to project?',
    subtitle: 'Choose your preferred scent trail and projection.',
    teaser: 'Next, what impression do you want to project?',
    isMulti: false,
    gridCols: 'repeat(auto-fit, minmax(220px, 1fr))',
    options: [
      {
        id: 'subtle',
        label: 'Subtle & Intimate',
        desc: 'Skin-close aura. Discreet, private, and whisper-close.',
        icon: Feather,
        intensityScore: 3
      },
      {
        id: 'radiant',
        label: 'Radiant & Elegant',
        desc: "Arm's length projection. Noticeable conversational distance.",
        icon: Sun,
        intensityScore: 4
      },
      {
        id: 'bold',
        label: 'Bold & Room-Filling',
        desc: 'Monumental beast-mode trail. Turns heads the moment you enter.',
        icon: Flame,
        intensityScore: 5
      }
    ]
  },
  {
    id: 'vibe',
    title: 'What impression do you want to leave behind?',
    subtitle: 'The defining mood that completes your personal aura.',
    teaser: 'Ready to reveal your bespoke recommendations!',
    isMulti: false,
    gridCols: 'repeat(auto-fit, minmax(200px, 1fr))',
    options: [
      {
        id: 'confident',
        label: 'Clean & Confident',
        desc: 'Crisp bergamot, fresh woods, and magnetic approachable charm',
        icon: Sun,
        vibe: 'fresh'
      },
      {
        id: 'seductive',
        label: 'Mysterious & Seductive',
        desc: 'Dark amber, roasted tonka, and intoxicating midnight allure',
        icon: Moon,
        vibe: 'seductive'
      },
      {
        id: 'prestigious',
        label: 'Royal & Prestigious',
        desc: 'Precious oud, rare saffron, noble cedar, and timeless authority',
        icon: Crown,
        vibe: 'prestigious'
      },
      {
        id: 'cozy',
        label: 'Warm & Comforting',
        desc: 'Bourbon vanilla, golden caramel, and soft cocooning luxury',
        icon: Heart,
        vibe: 'cozy'
      }
    ]
  }
];

export const FragranceDiagnostic = () => {
  const { products, addToCart, showToast } = useStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    gender: null,
    character: ['woody'], // default highlight matching picture
    occasion: null,
    sillage: null,
    vibe: null
  });
  const [isCalculated, setIsCalculated] = useState(false);
  const [selectedAnchorFormat, setSelectedAnchorFormat] = useState('30ml');

  const currentQuestion = QUESTIONS[currentStep];

  // Handle option selection / toggling
  const handleToggleOption = (optId) => {
    if (currentQuestion.isMulti) {
      setAnswers((prev) => {
        const existing = prev[currentQuestion.id] || [];
        const next = existing.includes(optId)
          ? existing.filter((id) => id !== optId)
          : [...existing, optId];
        return { ...prev, [currentQuestion.id]: next };
      });
    } else {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optId
      }));
    }
  };

  // Check if current step can advance
  const canContinue = useMemo(() => {
    const val = answers[currentQuestion.id];
    if (currentQuestion.isMulti) {
      return Array.isArray(val) && val.length > 0;
    }
    return Boolean(val);
  }, [answers, currentQuestion]);

  const handleContinue = () => {
    if (!canContinue) return;
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsCalculated(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = 'index.html';
    }
  };

  const handleRestart = () => {
    setAnswers({
      gender: null,
      character: [],
      occasion: null,
      sillage: null,
      vibe: null
    });
    setCurrentStep(0);
    setIsCalculated(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Recommendation Engine ---
  const { anchor, layeringRecommendations } = useMemo(() => {
    if (!products || products.length === 0) {
      return { anchor: null, layeringRecommendations: [] };
    }

    const qGender = answers.gender;
    const qChars = answers.character || [];
    const qOccasion = answers.occasion;
    const qSillage = answers.sillage;
    const qVibe = answers.vibe;

    // Filter relevant keywords from selected character options
    const selectedKeywords = [];
    qChars.forEach((cId) => {
      const charOpt = QUESTIONS[1].options.find((o) => o.id === cId);
      if (charOpt && charOpt.traits) {
        selectedKeywords.push(...charOpt.traits.map((t) => t.toLowerCase()));
      }
    });

    const scored = products.map((prod) => {
      let score = 0;
      const reasons = [];

      // 1. Gender Compatibility (35 pts)
      if (qGender === 'men') {
        if (prod.gender === 'Men') score += 35;
        else if (prod.gender === 'Unisex') score += 25;
        else score -= 80;
      } else if (qGender === 'women') {
        if (prod.gender === 'Women') score += 35;
        else if (prod.gender === 'Unisex') score += 25;
        else score -= 80;
      } else if (qGender === 'unisex') {
        if (prod.gender === 'Unisex') score += 35;
        else score += 20;
      }

      // 2. Character & Accord Overlap (up to 40 pts)
      const prodTraits = Array.isArray(prod.traits) ? prod.traits.map((t) => t.toLowerCase()) : [];
      const prodFamily = (prod.olfactoryFamily || '').toLowerCase();
      const prodChar = (prod.character || '').toLowerCase();

      let matchedTraitsCount = 0;
      selectedKeywords.forEach((kw) => {
        if (prodTraits.includes(kw) || prodFamily.includes(kw) || prodChar.includes(kw)) {
          score += 8;
          matchedTraitsCount++;
        }
      });
      if (matchedTraitsCount > 0) {
        reasons.push(`Harmonizes with ${qChars.join(', ')} character`);
      }

      // 3. Occasion Alignment (15 pts)
      if (qOccasion === 'daily') {
        if (prodTraits.some((t) => ['fresh', 'clean', 'citrus', 'aquatic', 'woody'].includes(t))) score += 15;
      } else if (qOccasion === 'date_night') {
        if (prodTraits.some((t) => ['amber', 'vanilla', 'sweet', 'warm', 'spicy'].includes(t))) score += 15;
      } else if (qOccasion === 'evening') {
        if (prod.tier === 'S' || prodTraits.some((t) => ['oud', 'leather', 'dark', 'oriental'].includes(t))) score += 15;
      } else if (qOccasion === 'versatile') {
        if (prod.tier === 'S') score += 15;
      }

      // 4. Sillage / Intensity Alignment (10 pts)
      const intensity = prod.intensityScore || (prod.tier === 'S' ? 5 : 4);
      if (qSillage === 'subtle' && intensity <= 3) score += 10;
      else if (qSillage === 'radiant' && (intensity === 4 || intensity === 3)) score += 10;
      else if (qSillage === 'bold' && intensity >= 4) score += 10;

      // 5. Personal Vibe (15 pts)
      if (qVibe === 'confident' && prodTraits.some((t) => ['fresh', 'cedar', 'woody', 'blue'].includes(t))) score += 15;
      else if (qVibe === 'seductive' && prodTraits.some((t) => ['amber', 'tonka', 'plum', 'dark'].includes(t))) score += 15;
      else if (qVibe === 'prestigious' && (prod.tier === 'S' || prodTraits.some((t) => ['oud', 'leather', 'saffron'].includes(t)))) score += 15;
      else if (qVibe === 'cozy' && prodTraits.some((t) => ['vanilla', 'caramel', 'sweet', 'gourmand'].includes(t))) score += 15;

      // Tier S Masterpiece Boost
      if (prod.tier === 'S') score += 10;

      // Normalize match percentage (85% to 99%)
      const matchPercentage = Math.min(99, Math.max(82, Math.round(80 + (score / 120) * 19)));

      return {
        product: prod,
        score,
        matchPercentage,
        reasons: reasons.length > 0 ? reasons : ['Perfect olfactory harmony with your answers']
      };
    });

    scored.sort((a, b) => b.score - a.score);

    const anchorItem = scored[0]?.product || products[0];
    
    // Pick 4 complementary recommendations that contrast nicely for layering
    const remaining = scored.filter((s) => s.product.id !== anchorItem.id);
    const companions = [];
    const seenFamilies = new Set([anchorItem.olfactoryFamily]);

    // First try picking from different olfactory families
    for (const item of remaining) {
      if (!seenFamilies.has(item.product.olfactoryFamily) && companions.length < 4) {
        companions.push(item.product);
        seenFamilies.add(item.product.olfactoryFamily);
      }
    }
    // Fill remaining if needed
    for (const item of remaining) {
      if (companions.length < 4 && !companions.some((c) => c.id === item.product.id)) {
        companions.push(item.product);
      }
    }

    return {
      anchor: scored[0] || { product: anchorItem, matchPercentage: 98, reasons: ['Optimal signature match'] },
      layeringRecommendations: companions
    };
  }, [products, answers]);

  const handleAddAnchorToBag = () => {
    if (!anchor?.product) return;
    const sizeObj = {
      '30ml': { label: '30ml Travel Spray', price: 45 },
      '50ml': { label: '50ml Bottle', price: 75 },
      '100ml': { label: '100ml Bottle', price: 125 }
    }[selectedAnchorFormat] || { label: '30ml Travel Spray', price: 45 };

    addToCart(anchor.product, 1, sizeObj.label, null, sizeObj.price);
  };

  const handleAddCompanionToBag = (prod) => {
    addToCart(prod, 1, '30ml Travel Spray', null, 45);
  };

  return (
    <div 
      style={{
        background: '#FAF8F5',
        minHeight: '85vh',
        padding: 'clamp(20px, 4vw, 44px) clamp(14px, 3.5vw, 32px)',
        borderRadius: '12px',
        border: '1px solid #EBE6DF',
        maxWidth: '960px',
        margin: '0 auto',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)'
      }}
    >
      {!isCalculated ? (
        /* ================= 5-STEP QUESTIONNAIRE (MATCHING PICTURE) ================= */
        <div>
          {/* Top Bar: Back | Centered VALENSZO FRAGRANCE | Step Counter */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '28px',
              borderBottom: '1px solid #EFEAE3',
              paddingBottom: '16px'
            }}
          >
            <button 
              onClick={handleBack} 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                background: 'none', 
                border: 'none', 
                color: '#27272A', 
                cursor: 'pointer', 
                fontSize: '0.88rem', 
                fontWeight: 600,
                padding: '4px 8px'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.2rem', letterSpacing: '0.18em', fontWeight: 800, color: '#111827' }}>
                VALENSZO
              </div>
              <div style={{ fontSize: '0.58rem', letterSpacing: '0.28em', color: '#6B7280', textTransform: 'uppercase', marginTop: '1px' }}>
                FRAGRANCE
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#4B5563', fontWeight: 600, minWidth: '70px', textAlign: 'right' }}>
              Step {currentStep + 1} of {QUESTIONS.length}
            </div>
          </div>

          {/* Stepper Progress Bar (Line with 5 Circle Nodes matching Picture) */}
          <div 
            style={{ 
              position: 'relative', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              margin: '0 auto 36px', 
              maxWidth: '540px', 
              padding: '0 24px' 
            }}
          >
            {/* Background Line */}
            <div 
              style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '36px', 
                right: '36px', 
                height: '2px', 
                background: '#E5E7EB', 
                transform: 'translateY(-50%)', 
                zIndex: 0 
              }} 
            />

            {/* Filled Progress Line */}
            <div 
              style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '36px', 
                width: `${(currentStep / (QUESTIONS.length - 1)) * 86}%`, 
                height: '2px', 
                background: '#000000', 
                transform: 'translateY(-50%)', 
                zIndex: 1, 
                transition: 'width 0.3s ease' 
              }} 
            />

            {/* Step Circles */}
            {QUESTIONS.map((_, idx) => {
              const isCompleted = idx < currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div 
                  key={idx}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: isCompleted ? '#000000' : isCurrent ? '#000000' : '#FAF8F5',
                    border: isCompleted ? '2px solid #000000' : isCurrent ? '2px solid #000000' : '2px solid #D1D5DB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    position: 'relative',
                    zIndex: 2,
                    transition: 'all 0.25s ease'
                  }}
                >
                  {isCompleted ? (
                    <Check size={13} color="#ffffff" strokeWidth={3} />
                  ) : isCurrent ? (
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff' }} />
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Question Title & Subtitle (Serif Centered) */}
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 28px' }}>
            <h2 
              style={{ 
                fontFamily: 'var(--font-brand, serif)', 
                fontSize: 'clamp(1.4rem, 3.5vw, 2.1rem)', 
                fontWeight: 700, 
                color: '#111827', 
                margin: '0 0 8px', 
                lineHeight: 1.25 
              }}
            >
              {currentQuestion.title}
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.88rem', margin: 0 }}>
              {currentQuestion.subtitle}
            </p>
          </div>

          {/* Card Options Grid (Matching Picture 4x2 Grid on Step 2!) */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: currentQuestion.gridCols,
              gap: '12px',
              marginBottom: '36px'
            }}
          >
            {currentQuestion.options.map((opt) => {
              const isSelected = currentQuestion.isMulti 
                ? (answers[currentQuestion.id] || []).includes(opt.id)
                : answers[currentQuestion.id] === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => handleToggleOption(opt.id)}
                  style={{
                    position: 'relative',
                    background: isSelected ? '#F7F1E7' : '#FFFFFF',
                    border: isSelected ? '1.5px solid #C5A059' : '1px solid #EBE7E0',
                    borderRadius: '8px',
                    padding: '24px 14px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 14px rgba(197, 160, 89, 0.16)' : '0 2px 6px rgba(0, 0, 0, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '128px'
                  }}
                >
                  {/* Top-Right Gold Check Badge on Selected Cards (Matching Picture!) */}
                  {isSelected && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#C5A059',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                      }}
                    >
                      <Check size={11} strokeWidth={3} />
                    </div>
                  )}

                  {/* Centered Line Art Icon */}
                  <div style={{ color: isSelected ? '#B45309' : '#374151', marginBottom: '8px' }}>
                    <opt.icon size={28} strokeWidth={1.6} />
                  </div>

                  {/* Card Title */}
                  <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                    {opt.label}
                  </div>

                  {/* Subtext */}
                  <div style={{ fontSize: '0.72rem', color: '#6B7280', lineHeight: 1.35, maxWidth: '170px' }}>
                    {opt.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Area: Teaser + CONTINUE Button + Retake */}
          <div style={{ textAlign: 'center', maxWidth: '440px', margin: '0 auto' }}>
            {currentQuestion.teaser && (
              <div 
                style={{ 
                  fontFamily: 'var(--font-brand, serif)', 
                  fontSize: '1.05rem', 
                  color: '#18181B', 
                  marginBottom: '16px',
                  fontWeight: 600
                }}
              >
                {currentQuestion.teaser}
              </div>
            )}

            <button
              onClick={handleContinue}
              disabled={!canContinue}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '4px',
                background: canContinue ? '#000000' : '#D1D5DB',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.86rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: canContinue ? 'pointer' : 'not-allowed',
                boxShadow: canContinue ? '0 4px 16px rgba(0, 0, 0, 0.2)' : 'none',
                transition: 'all 0.2s ease',
                marginBottom: '16px'
              }}
            >
              Continue
            </button>

            <div>
              <button
                onClick={handleRestart}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RotateCcw size={13} />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ================= RECOMMENDATION RESULTS (MATCHING PICTURE 2) ================= */
        <div>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '0.74rem', letterSpacing: '0.22em', color: '#B45309', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
              VALENSZO OLFACTORY DIAGNOSTIC
            </div>
            <h1 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#111827', margin: '0 0 8px', fontWeight: 700 }}>
              YOUR SCENT MATCH
            </h1>
            <p style={{ color: '#6B7280', fontSize: '0.92rem', margin: 0, fontStyle: 'italic' }}>
              One Anchor &rarr; Four Recommendations &rarr; Any Two Can Layer
            </p>
          </div>

          {/* 1. YOUR ANCHOR SHOWCASE */}
          {anchor && anchor.product && (
            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#111827', marginBottom: '12px' }}>
                YOUR ANCHOR FRAGRANCE
              </div>

              <div 
                style={{
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1.5px solid #111827',
                  padding: 'clamp(18px, 3.5vw, 32px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '28px',
                  alignItems: 'center'
                }}
              >
                {/* Left: Bottle Image with Match Badge */}
                <div style={{ position: 'relative' }}>
                  <div style={{ aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: '#F4F4F5' }}>
                    <img 
                      src={anchor.product.images?.[0] || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=700&auto=format&fit=crop&q=80'}
                      alt={anchor.product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div 
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: '#111827',
                      color: '#F59E0B',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Sparkles size={13} />
                    <span>{anchor.matchPercentage}% MATCH &bull; YOUR PERFECT BASE</span>
                  </div>
                </div>

                {/* Right: Details & Add */}
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '4px' }}>
                    {anchor.product.gender} &bull; {anchor.product.category}
                  </div>

                  <h2 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '2rem', fontWeight: 800, margin: '0 0 6px', color: '#111827' }}>
                    {anchor.product.name}
                  </h2>

                  {anchor.product.brandInspiration && (
                    <div style={{ fontSize: '0.86rem', color: '#B45309', fontWeight: 700, marginBottom: '10px' }}>
                      Inspired by {anchor.product.brandInspiration} &bull; Catalog No. {anchor.product.catalogNo}
                    </div>
                  )}

                  <p style={{ color: '#4B5563', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 16px' }}>
                    {anchor.product.tagline || anchor.product.description}
                  </p>

                  {/* Why it matches */}
                  <div style={{ background: '#FAF8F5', border: '1px solid #EBE6DF', borderRadius: '6px', padding: '12px 14px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#111827', marginBottom: '6px' }}>
                      Why this matches your chemistry:
                    </div>
                    {anchor.reasons.map((r, rIdx) => (
                      <div key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#374151' }}>
                        <CheckCircle2 size={13} color="#059669" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>

                  {/* Format Selector */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', marginBottom: '8px' }}>
                      Select Format
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[
                        { key: '30ml', label: '30ml Travel', price: 'RM45' },
                        { key: '50ml', label: '50ml Bottle', price: 'RM75' },
                        { key: '100ml', label: '100ml Bottle', price: 'RM125' }
                      ].map((fmt) => (
                        <button
                          key={fmt.key}
                          type="button"
                          onClick={() => setSelectedAnchorFormat(fmt.key)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '4px',
                            background: selectedAnchorFormat === fmt.key ? '#111827' : '#FFFFFF',
                            color: selectedAnchorFormat === fmt.key ? '#FFFFFF' : '#111827',
                            border: selectedAnchorFormat === fmt.key ? '1px solid #111827' : '1px solid #D1D5DB',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <div>{fmt.label}</div>
                          <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{fmt.price}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    type="button"
                    onClick={handleAddAnchorToBag}
                    style={{
                      padding: '14px 32px',
                      borderRadius: '4px',
                      background: '#111827',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.25)'
                    }}
                  >
                    <ShoppingBag size={16} />
                    <span>Add Anchor to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. FOUR RECOMMENDATIONS TO LAYER */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#111827', marginBottom: '14px' }}>
              FOUR RECOMMENDATIONS TO LAYER
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px' }}>
              {layeringRecommendations.map((comp) => (
                <div 
                  key={comp.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '14px',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ aspectRatio: '1', borderRadius: '6px', overflow: 'hidden', background: '#F4F4F5', marginBottom: '10px' }}>
                    <img 
                      src={comp.images?.[0] || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=700&auto=format&fit=crop&q=80'} 
                      alt={comp.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ fontSize: '0.68rem', color: '#B45309', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {comp.concentration || 'Extrait de Parfum'}
                  </div>

                  <div style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1rem', fontWeight: 700, color: '#111827', margin: '4px 0 2px' }}>
                    {comp.name}
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#6B7280', marginBottom: '8px' }}>
                    {(comp.traits || []).slice(0, 3).join(' • ')}
                  </div>

                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#111827', marginBottom: '10px' }}>
                    RM{comp.price || 45}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddCompanionToBag(comp)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      background: '#FAF8F5',
                      color: '#111827',
                      border: '1px solid #D1D5DB',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    + Add to Bag
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. COLLECTION CALLOUT */}
          <div 
            style={{
              background: 'linear-gradient(135deg, #111827 0%, #000000 100%)',
              borderRadius: '10px',
              padding: 'clamp(24px, 4vw, 36px)',
              color: '#FFFFFF',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ fontSize: '0.74rem', letterSpacing: '0.18em', color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
              BESPOKE PERFUMERY
            </div>
            <h3 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', margin: '0 0 10px', color: '#FFFFFF' }}>
              Explore the Full Olfactory Collection
            </h3>
            <p style={{ color: '#D1D5DB', fontSize: '0.9rem', maxWidth: '540px', margin: '0 auto 24px', lineHeight: 1.5 }}>
              Discover our complete range of artisanal fragrances crafted with pure French oils and 12h+ long-lasting sillage.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
              <a
                href="collection.html"
                style={{
                  padding: '14px 28px',
                  borderRadius: '4px',
                  background: '#FFFFFF',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Shop All Fragrances</span>
                <ArrowRight size={15} />
              </a>

              <button
                type="button"
                onClick={handleRestart}
                style={{
                  padding: '14px 24px',
                  borderRadius: '4px',
                  background: 'transparent',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.4)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RotateCcw size={14} />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
