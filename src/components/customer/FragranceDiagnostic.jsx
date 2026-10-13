import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import bundleRecommendations from '../../data/bundleRecommendations.json';
import { 
  ArrowLeft, 
  RotateCcw, 
  Check, 
  Sparkles, 
  MessageCircle, 
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
  ArrowRight,
  ShoppingBag
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
  const { products, addToCart, showToast, setIsCartOpen } = useStore();

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
    
    // Official Excel Bundle Recommendations lookup for R1, R2, R3, R4
    const getLookupSku = (p) => {
      const rawSku = (p.sku || p.id || '').toUpperCase();
      const match = rawSku.match(/(?:VLZ-)?([MW])-?(\d+)/i);
      if (match) {
        const prefix = match[1].toUpperCase();
        const num = match[2].padStart(3, '0');
        return prefix + num;
      }
      if (p.specs?.catalogNo != null || p.catalogNo != null) {
        const catNum = p.specs?.catalogNo ?? p.catalogNo;
        const prefix = (p.gender || p.category || '').toLowerCase().includes('women') ? 'W' : 'M';
        return prefix + String(catNum).padStart(3, '0');
      }
      return null;
    };

    const targetKey = getLookupSku(anchorItem);
    const bundleData = targetKey ? bundleRecommendations[targetKey] : null;

    let companions = [];
    if (bundleData && Array.isArray(bundleData.recommendations) && bundleData.recommendations.length > 0) {
      companions = bundleData.recommendations.map((rec) => {
        const match = products.find((p) => {
          const pGender = (p.gender || p.category || '').toLowerCase();
          const recGender = (rec.gender || (rec.sku.startsWith('W') ? 'women' : 'men')).toLowerCase();
          const isSameGender = pGender.includes(recGender) || recGender.includes(pGender);

          if (rec.catalogNo && isSameGender) {
            if (Number(p.catalogNo) === Number(rec.catalogNo)) return true;
            if (Number(p.specs?.catalogNo) === Number(rec.catalogNo)) return true;
          }
          if (p.sku && p.sku.toUpperCase().replace(/[^A-Z0-9]/g, '').includes(rec.sku.replace(/[^A-Z0-9]/g, ''))) return true;
          if (p.id && p.id.toUpperCase().replace(/[^A-Z0-9]/g, '').includes(rec.sku.replace(/[^A-Z0-9]/g, ''))) return true;
          if (p.name && rec.name && p.name.toLowerCase().trim() === rec.name.toLowerCase().trim()) return true;
          return false;
        });

        const companionProduct = match ? { ...match } : {
          id: `rec-${rec.sku.toLowerCase()}`,
          name: rec.name,
          brand: rec.brand,
          brandInspiration: rec.brand,
          dominantAccord: rec.macroZone,
          price: 45,
          price_30ml: 45,
          price_50ml: 65,
          images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80']
        };

        return {
          ...companionProduct,
          roleKey: rec.key,
          role: rec.role,
          layerScore: rec.layerScore,
          macroZone: rec.macroZone
        };
      });
    } else {
      // Fallback if anchor not found in bundle table
      const remaining = scored.filter((s) => s.product.id !== anchorItem.id);
      const fallbackList = [];
      const seenFamilies = new Set([anchorItem.olfactoryFamily]);

      for (const item of remaining) {
        if (!seenFamilies.has(item.product.olfactoryFamily) && fallbackList.length < 4) {
          fallbackList.push({
            ...item.product,
            roleKey: `R${fallbackList.length + 1}`,
            role: ['Closest Match', 'Same Character', 'Complementary', 'Layering Bridge'][fallbackList.length],
            layerScore: 88 - fallbackList.length * 2
          });
          seenFamilies.add(item.product.olfactoryFamily);
        }
      }
      for (const item of remaining) {
        if (fallbackList.length < 4 && !fallbackList.some((c) => c.id === item.product.id)) {
          fallbackList.push({
            ...item.product,
            roleKey: `R${fallbackList.length + 1}`,
            role: ['Closest Match', 'Same Character', 'Complementary', 'Layering Bridge'][fallbackList.length],
            layerScore: 88 - fallbackList.length * 2
          });
        }
      }
      companions = fallbackList;
    }

    return {
      anchor: scored[0] || { product: anchorItem, matchPercentage: 98, reasons: ['Optimal signature match'] },
      layeringRecommendations: companions
    };
  }, [products, answers]);



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
                      {(() => {
                        const p = anchor?.product;
                        const p30 = p?.price_30ml ?? p?.sizes?.find(s => s.ml === 30 || s.label?.includes('30'))?.price ?? 45;
                        const p50 = p?.price_50ml ?? p?.sizes?.find(s => s.ml === 50 || s.label?.includes('50'))?.price ?? 65;
                        const p100 = p?.price_100ml ?? p?.sizes?.find(s => s.ml === 100 || s.label?.includes('100'))?.price ?? 125;
                        return [
                          { key: '30ml', label: '30ml Travel', price: `RM${p30}` },
                          { key: '50ml', label: '50ml Bottle', price: `RM${p50}` },
                          { key: '100ml', label: '100ml Bottle', price: `RM${p100}` }
                        ];
                      })().map((fmt) => (
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

                  {/* Promotional Inquiry & Explore CTAs */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(anchor.product, 1, selectedAnchorFormat);
                        showToast(`Added ${anchor.product.name} (${selectedAnchorFormat}) to bag`);
                        setIsCartOpen(true);
                      }}
                      style={{
                        padding: '14px 26px',
                        borderRadius: '4px',
                        background: '#111827',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        letterSpacing: '0.08em',
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
                      <span>Add to Bag</span>
                    </button>

                    <a
                      href={`product.html?product=${encodeURIComponent(anchor.product?.name || anchor.product?.id)}`}
                      style={{
                        padding: '13px 22px',
                        borderRadius: '4px',
                        background: '#FFFFFF',
                        border: '1px solid #D1D5DB',
                        color: '#111827',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>Explore</span>
                      <ArrowRight size={15} />
                    </a>

                    <a
                      href={`https://wa.me/60182868402?text=${encodeURIComponent(`Hello Valenszo! 🛍️\n\nI just took your Scent Discovery Quiz and my signature match is:\n• Perfume: ${anchor.product?.name}\n• Format: ${selectedAnchorFormat}\n• Match Score: ${anchor.matchPercentage}%\n\nCould you please assist me with ordering / stock availability? Thank you!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '13px 20px',
                        borderRadius: '4px',
                        background: '#128C7E',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(18,140,126,0.25)'
                      }}
                    >
                      <MessageCircle size={16} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. FOUR RECOMMENDATIONS TO LAYER */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#926917', fontWeight: 800 }}>
                  Signature Pairings &bull; Layering Engine
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827' }}>
                  FOUR RECOMMENDATIONS TO LAYER
                </div>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#6B7280', fontStyle: 'italic' }}>
                One Anchor &rarr; Four Recommendations &rarr; Any Two Can Layer
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
              {layeringRecommendations.map((comp) => (
                <div 
                  key={comp.id || comp.sku}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '14px',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <div>
                    {/* Top Role & Score Pill */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.66rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#926917', background: '#faf5ea', padding: '2px 6px', borderRadius: '4px' }}>
                        {comp.roleKey ? `${comp.roleKey} · ${comp.role}` : 'Complementary'}
                      </span>
                      {comp.layerScore && (
                        <span style={{ fontSize: '0.64rem', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                          {comp.layerScore}% Match
                        </span>
                      )}
                    </div>

                    <a 
                      href={`product.html?product=${encodeURIComponent(comp.name || comp.id)}`}
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                      <div style={{ aspectRatio: '1', borderRadius: '6px', overflow: 'hidden', background: '#F4F4F5', marginBottom: '10px' }}>
                        <img 
                          src={comp.images?.[0] || comp.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=700&auto=format&fit=crop&q=80'} 
                          alt={comp.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>

                      <div style={{ fontSize: '0.68rem', color: '#B45309', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {comp.concentration || 'Extrait de Parfum'}
                      </div>

                      <div style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '0.98rem', fontWeight: 700, color: '#111827', margin: '4px 0 2px' }}>
                        {comp.name}
                      </div>

                      {(comp.brand || comp.brandInspiration) && (
                        <div style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 600, marginBottom: '4px' }}>
                          Inspired by {comp.brand || comp.brandInspiration}
                        </div>
                      )}

                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#111827', margin: '6px 0 10px' }}>
                        RM{comp.price_50ml || comp.price || 65}
                      </div>
                    </a>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(comp, 1, '50ml');
                        showToast(`Added ${comp.name} to bag`);
                        setIsCartOpen(true);
                      }}
                      style={{
                        flex: 1,
                        padding: '9px 10px',
                        borderRadius: '6px',
                        background: '#111827',
                        color: '#FFFFFF',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <ShoppingBag size={13} />
                      <span>Add to Bag</span>
                    </button>
                    <a
                      href={`product.html?product=${encodeURIComponent(comp.name || comp.id)}`}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        background: '#F9FAFB',
                        border: '1px solid #D1D5DB',
                        color: '#111827',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <ArrowRight size={13} />
                    </a>
                  </div>
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
