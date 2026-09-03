import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  ShoppingBag, 
  CheckCircle2, 
  Flame, 
  Droplet, 
  Wind, 
  Sun, 
  Moon, 
  Heart, 
  ShieldCheck, 
  Eye, 
  Award,
  Crown,
  Compass
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 'gender',
    title: 'Who is this fragrance crafted for?',
    subtitle: 'Select the intended wearer profile to narrow down our 345 creations.',
    icon: Compass,
    options: [
      {
        id: 'men',
        label: 'A Gentleman (Pour Homme)',
        desc: 'Magnetic, noble, and architecturally structured for men.',
        tag: 'Pour Homme',
        gender: 'Men'
      },
      {
        id: 'women',
        label: 'A Lady (Pour Femme)',
        desc: 'Radiant, enchanting, and gracefully alluring for women.',
        tag: 'Pour Femme',
        gender: 'Women'
      },
      {
        id: 'unisex',
        label: 'Gender-Neutral & Niche (Unisex)',
        desc: 'Artistic, borderless, and boundary-defying Haute Parfumerie.',
        tag: 'Niche & Unisex',
        gender: 'Unisex'
      }
    ]
  },
  {
    id: 'atmosphere',
    title: 'What olfactory universe resonates with you most?',
    subtitle: 'The primary character aura that defines your scent mood.',
    icon: Wind,
    options: [
      {
        id: 'fresh_citrus',
        label: 'Crisp Oceanic & Sparkling Citrus',
        desc: 'Reggio bergamot, sea spray, iced mandarin, and vibrant solar energy.',
        clusters: ['Fresh / Aquatic / Citrus', 'Fresh / Aquatic / Citrus / Green'],
        traits: ['Fresh', 'Aquatic', 'Citrus']
      },
      {
        id: 'blue_woody',
        label: 'Modern Blue, Aromatic & Woody',
        desc: 'Crisp lavender, ambroxan, cedar, and magnetic crowd-stopping appeal.',
        clusters: ['Blue / Aromatic / Fresh-Woody'],
        traits: ['Blue', 'Aromatic', 'Fresh-Woody']
      },
      {
        id: 'gourmand_vanilla',
        label: 'Decadent Gourmand, Amber & Warm Vanilla',
        desc: 'Rich bourbon vanilla, praline, roasted tonka, caramelized sugar, and warm amber.',
        clusters: ['Sweet / Amber / Gourmand', 'Sweet / Gourmand / Vanilla'],
        traits: ['Sweet', 'Gourmand', 'Vanilla', 'Amber']
      },
      {
        id: 'romantic_floral',
        label: 'Romantic Rose, Peony & Floral Bouquets',
        desc: 'Damascena rose, pink peonies, blooming jasmine, and poetic floral elegance.',
        clusters: ['Rose / Peony / Romantic Floral', 'Floral / Bouquet'],
        traits: ['Rose', 'Peony', 'Floral', 'Romantic Floral']
      },
      {
        id: 'dark_seductive',
        label: 'Dark, Seductive & Nocturnal Mystery',
        desc: 'Black coffee, smoky leather, intoxicating plum, and magnetic midnight allure.',
        clusters: ['Dark / Seductive / Night', 'Leather / Smoky / Dark'],
        traits: ['Dark', 'Seductive', 'Night', 'Leather', 'Smoky']
      },
      {
        id: 'oud_resinous',
        label: 'Royal Oud, Spices & Oriental Opulence',
        desc: 'Precious agarwood, smoky incense, golden amber, and Middle Eastern prestige.',
        clusters: ['Oud / Oriental / Resinous', 'Spicy / Warm / Tobacco'],
        traits: ['Oud', 'Oriental', 'Resinous', 'Tobacco', 'Spicy']
      },
      {
        id: 'fruity_tropical',
        label: 'Juicy Tropical Fruits & Sun-Drenched Nectar',
        desc: 'Sweet mango, wild berries, juicy peach, passionfruit, and cheerful radiance.',
        clusters: ['Fruity / Juicy / Tropical', 'Fruity-Floral / Mass Appeal'],
        traits: ['Fruity', 'Tropical', 'Juicy']
      },
      {
        id: 'clean_musk',
        label: 'Clean Cotton, Silky Musk & Powdery Iris',
        desc: 'Freshly pressed linen, white musk, powdery iris, and pure skin warmth.',
        clusters: ['Clean / Musk / Powdery'],
        traits: ['Clean', 'Musk', 'Powdery']
      }
    ]
  },
  {
    id: 'occasion',
    title: 'Where do you envision wearing this creation?',
    subtitle: 'Match the scenario where you want to leave an unforgettable impression.',
    icon: Sun,
    options: [
      {
        id: 'daily_signature',
        label: 'Everyday Signature & Professional',
        desc: 'Effortless luxury for the workplace, executive meetings, and daily wear.',
        occasionTag: 'Everyday Signature',
        preferredIntensity: [3, 4]
      },
      {
        id: 'romantic_date',
        label: 'Intimate Dates & Romantic Encounters',
        desc: 'Close-quarters magnetism designed to linger intimately on the skin.',
        occasionTag: 'Intimate & Romantic',
        preferredIntensity: [4, 4.5]
      },
      {
        id: 'night_out',
        label: 'VIP Galas, Nightlife & Grand Events',
        desc: 'High-impact projection that cuts through the crowd with commanding elegance.',
        occasionTag: 'Grand Night Out',
        preferredIntensity: [4.5, 5]
      },
      {
        id: 'casual_outdoor',
        label: 'Tropical Sun, Weekend Leisure & Sport',
        desc: 'Invigorating, active, and refreshing under warm outdoor conditions.',
        occasionTag: 'Outdoor & Leisure',
        preferredIntensity: [3, 4]
      }
    ]
  },
  {
    id: 'sillage',
    title: 'What projection and trail intensity do you desire?',
    subtitle: 'How far should your fragrance project into the room?',
    icon: Flame,
    options: [
      {
        id: 'intimate',
        label: 'Intimate Skin Scent (Subtle Aura)',
        desc: 'Discreet and private. Noticeable only within an intimate whisper or embrace.',
        intensityScore: 3
      },
      {
        id: 'radiant',
        label: 'Radiant & Elegant (Arm’s Length)',
        desc: 'The golden classic. Noticeable within normal conversational distance (2–3 feet).',
        intensityScore: 4
      },
      {
        id: 'beast_mode',
        label: 'Room-Filling & Monumental (Beast Mode)',
        desc: 'Maximum sillage and intoxicating trail. Turns heads the moment you enter.',
        intensityScore: 5
      }
    ]
  },
  {
    id: 'sweetness',
    title: 'What is your preference regarding sweetness?',
    subtitle: 'From bone-dry mineral freshness to rich caramelized indulgence.',
    icon: Heart,
    options: [
      {
        id: 'dry',
        label: 'Crisp & Dry (Zero Sugar)',
        desc: 'Strictly mineral, ocean breeze, woods, or citrus rind without sweetness.',
        sweetnessType: 'dry'
      },
      {
        id: 'balanced',
        label: 'Balanced Warmth (Subtle & Natural)',
        desc: 'Delicately balanced with natural spice, amber warmth, or light floral nectar.',
        sweetnessType: 'balanced'
      },
      {
        id: 'rich',
        label: 'Rich & Decadent (Sweet Gourmand)',
        desc: 'Heavy bourbon vanilla, toasted tonka bean, caramel, melted honey, or praline.',
        sweetnessType: 'sweet'
      }
    ]
  },
  {
    id: 'woods_spices',
    title: 'How do you feel about woody, smoky, and spicy accords?',
    subtitle: 'The foundational base notes that anchor the perfume on your skin.',
    icon: Award,
    options: [
      {
        id: 'bold_woods',
        label: 'I love deep smokiness, rich leather, dark oud & tobacco',
        desc: 'Profound, opulent, and authoritative resinous depth.',
        woodPreference: 'bold'
      },
      {
        id: 'clean_woods',
        label: 'I prefer clean, refined cedarwood, sandalwood & vetiver',
        desc: 'Structured, polished, and contemporary gentlemanly woods.',
        woodPreference: 'clean'
      },
      {
        id: 'minimal_woods',
        label: 'Keep woods minimal; prioritize freshness, flowers or fruits',
        desc: 'Light, airy base without heavy timber or incense.',
        woodPreference: 'minimal'
      }
    ]
  },
  {
    id: 'florals_fruits',
    title: 'What role should florals or fruit accents play?',
    subtitle: 'The blooming heart and uplifting facets of your scent profile.',
    icon: Droplet,
    options: [
      {
        id: 'regal_floral',
        label: 'Lush & Regal Florals (Rose, Jasmine, Tuberose, Violet)',
        desc: 'A magnificent bouquet that takes center stage.',
        floralPreference: 'regal'
      },
      {
        id: 'juicy_fruits',
        label: 'Succulent Fruits (Peach, Berries, Apple, Pineapple)',
        desc: 'Mouthwatering fruit nectar that adds juicy, lively vibrance.',
        floralPreference: 'juicy'
      },
      {
        id: 'no_florals',
        label: 'Strictly Minimal (Aromatic Herbs, Woods or Clean Citrus)',
        desc: 'A dry, crisp profile without sweet petals or fruits.',
        floralPreference: 'none'
      }
    ]
  },
  {
    id: 'climate',
    title: 'In what climate will you wear this fragrance most?',
    subtitle: 'Ensures optimal diffusion and longevity under your daily conditions.',
    icon: Sun,
    options: [
      {
        id: 'tropical_heat',
        label: 'Tropical Heat & Humidity (Malaysia Daytime)',
        desc: 'Formulated to cut through warmth without becoming cloying or heavy.',
        climateType: 'tropical'
      },
      {
        id: 'air_conditioned',
        label: 'Air-Conditioned Lounges & Cool Evenings',
        desc: 'Allows warm spices, amber, and heavier extracts to unfold luxuriously.',
        climateType: 'cool'
      },
      {
        id: 'all_weather',
        label: 'All-Year All-Weather Versatility',
        desc: 'A versatile chameleon that adapts seamlessly across all environments.',
        climateType: 'all'
      }
    ]
  },
  {
    id: 'personality',
    title: 'What personal statement should your scent express?',
    subtitle: 'The psychological aura and impression you project onto others.',
    icon: Crown,
    options: [
      {
        id: 'commanding',
        label: 'Commanding, Mysterious & Unforgettable',
        desc: 'A powerful presence that exudes authority, prestige, and intrigue.',
        vibe: 'commanding'
      },
      {
        id: 'sophisticated',
        label: 'Refined, Impeccable & Sophisticated',
        desc: 'Subtle high luxury, cultured poise, and effortless elegance.',
        vibe: 'sophisticated'
      },
      {
        id: 'magnetic',
        label: 'Magnetic, Seductive & Irresistibly Addictive',
        desc: 'A sensual siren-call that draws people in and leaves a memorable trail.',
        vibe: 'magnetic'
      },
      {
        id: 'invigorating',
        label: 'Vibrant, Fresh, Approachable & Uplifting',
        desc: 'Radiant optimism, clean confidence, and breezy vitality.',
        vibe: 'fresh'
      }
    ]
  },
  {
    id: 'tier',
    title: 'What category of our collection do you wish to explore?',
    subtitle: 'Select between globally celebrated icons or rare artisanal extraits.',
    icon: Sparkles,
    options: [
      {
        id: 'tier_s',
        label: '★ Tier S · Global Launch Icons (Recommended)',
        desc: 'The top 55 most legendary, universally celebrated masterpieces.',
        tierTarget: 'S'
      },
      {
        id: 'tier_a',
        label: 'Tier A · Premium Haute Extraits',
        desc: 'Distinctive, elevated connoisseur scents for sophisticated collectors.',
        tierTarget: 'A'
      },
      {
        id: 'niche',
        label: 'Artisanal & Niche Rarities',
        desc: 'Avant-garde, rare formulations designed for the discerning nose.',
        tierTarget: 'Niche'
      },
      {
        id: 'open',
        label: 'Surprise Me (Pure Scent Chemistry)',
        desc: 'Scan the entire 345-fragrance catalog with zero bias.',
        tierTarget: 'All'
      }
    ]
  }
];

export const FragranceDiagnostic = () => {
  const { products, addToCart, setSelectedProductModal, navigateToCatalog } = useStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCalculated, setIsCalculated] = useState(false);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(1); // Default to 50ml or 100ml

  const currentQuestion = QUESTIONS[currentStep];

  const handleSelectOption = (option) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(updatedAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Finished all 10 questions
      setIsCalculated(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCalculated(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Recommendation Engine Scoring ---
  const recommendations = useMemo(() => {
    if (!isCalculated || !products || products.length === 0) return [];

    const scored = products.map((prod) => {
      let score = 0;
      const reasons = [];

      const qGender = answers.gender;
      const qAtmo = answers.atmosphere;
      const qOccasion = answers.occasion;
      const qSillage = answers.sillage;
      const qSweet = answers.sweetness;
      const qWoods = answers.woods_spices;
      const qFlorals = answers.florals_fruits;
      const qClimate = answers.climate;
      const qVibe = answers.personality;
      const qTier = answers.tier;

      // 1. Gender Alignment (Heavy weight: 35 pts)
      if (qGender) {
        if (qGender.gender === 'Men') {
          if (prod.gender === 'Men') {
            score += 35;
          } else if (prod.gender === 'Unisex') {
            score += 28;
          } else {
            score -= 100; // Incompatible
          }
        } else if (qGender.gender === 'Women') {
          if (prod.gender === 'Women') {
            score += 35;
          } else if (prod.gender === 'Unisex') {
            score += 28;
          } else {
            score -= 100; // Incompatible
          }
        } else if (qGender.gender === 'Unisex') {
          if (prod.gender === 'Unisex') {
            score += 35;
            reasons.push('Artisanal gender-neutral formulation');
          } else {
            score += 15;
          }
        }
      }

      // 2. Olfactory Universe & Clusters (35 pts)
      if (qAtmo) {
        let clusterMatch = false;
        if (qAtmo.clusters?.includes(prod.character) || qAtmo.clusters?.includes(prod.olfactoryFamily)) {
          score += 25;
          clusterMatch = true;
          reasons.push(`Aligns with ${prod.character.split('/')[0].trim()} character`);
        }

        // Check traits overlap
        if (prod.traits && qAtmo.traits) {
          const matchingTraits = prod.traits.filter((t) =>
            qAtmo.traits.some((qt) => qt.toLowerCase() === t.toLowerCase())
          );
          if (matchingTraits.length > 0) {
            score += matchingTraits.length * 5;
            if (!clusterMatch) {
              reasons.push(`Features ${matchingTraits.join(' & ')} facets`);
            }
          }
        }
      }

      // 3. Sillage & Intensity (15 pts)
      if (qSillage) {
        const prodIntensity = prod.intensityScore || (prod.tier === 'S' ? 5 : 4);
        const diff = Math.abs(prodIntensity - qSillage.intensityScore);
        if (diff === 0) {
          score += 15;
          reasons.push(prod.sillage ? `${prod.sillage} sillage` : 'Desired projection level');
        } else if (diff <= 1) {
          score += 8;
        }
      }

      // 4. Sweetness Profile (15 pts)
      if (qSweet) {
        const charLower = (prod.character || '').toLowerCase();
        const descLower = (prod.description || '').toLowerCase();
        const isSweet = charLower.includes('sweet') || charLower.includes('gourmand') || charLower.includes('vanilla') || descLower.includes('vanilla');

        if (qSweet.sweetnessType === 'sweet' && isSweet) {
          score += 15;
          reasons.push('Rich vanilla and gourmand warmth');
        } else if (qSweet.sweetnessType === 'dry' && !isSweet) {
          score += 15;
          reasons.push('Dry, crisp profile without sugary weight');
        } else if (qSweet.sweetnessType === 'balanced') {
          score += 12;
        }
      }

      // 5. Woods & Spices (15 pts)
      if (qWoods) {
        const char = (prod.character || '').toLowerCase();
        if (qWoods.woodPreference === 'bold') {
          if (char.includes('oud') || char.includes('tobacco') || char.includes('leather') || char.includes('spicy')) {
            score += 15;
            reasons.push('Smoky leather, spices, and exotic woods');
          }
        } else if (qWoods.woodPreference === 'clean') {
          if (char.includes('woody') || char.includes('vetiver') || char.includes('aromatic')) {
            score += 15;
            reasons.push('Noble cedarwood and clean vetiver structure');
          }
        } else if (qWoods.woodPreference === 'minimal') {
          if (!char.includes('oud') && !char.includes('leather')) {
            score += 12;
          }
        }
      }

      // 6. Florals & Fruits (15 pts)
      if (qFlorals) {
        const char = (prod.character || '').toLowerCase();
        if (qFlorals.floralPreference === 'regal' && (char.includes('rose') || char.includes('floral') || char.includes('bouquet'))) {
          score += 15;
          reasons.push('Precious Damascena rose and floral bouquet');
        } else if (qFlorals.floralPreference === 'juicy' && (char.includes('fruity') || char.includes('tropical'))) {
          score += 15;
          reasons.push('Succulent fruity and tropical nectar');
        } else if (qFlorals.floralPreference === 'none' && !char.includes('floral') && !char.includes('rose')) {
          score += 12;
        }
      }

      // 7. Climate & Occasion (15 pts)
      if (qClimate) {
        const char = (prod.character || '').toLowerCase();
        if (qClimate.climateType === 'tropical' && (char.includes('fresh') || char.includes('aquatic') || char.includes('citrus'))) {
          score += 15;
          reasons.push('Engineered for warm tropical diffusion');
        } else if (qClimate.climateType === 'cool' && (char.includes('amber') || char.includes('night') || char.includes('oud'))) {
          score += 15;
          reasons.push('Perfect for air-conditioned lounges and evenings');
        } else if (qClimate.climateType === 'all') {
          score += 10;
        }
      }

      // 8. Tier Preference (15 pts)
      if (qTier) {
        if (qTier.tierTarget === 'S' && prod.tier === 'S') {
          score += 20;
          reasons.push('Official Tier S Launch Icon & crowd-pleaser');
        } else if (qTier.tierTarget === 'A' && prod.tier === 'A') {
          score += 18;
          reasons.push('Tier A Premium Haute formulation');
        } else if (qTier.tierTarget === 'Niche' && (prod.gender === 'Unisex' || prod.category.includes('Niche'))) {
          score += 20;
          reasons.push('Artisanal niche rarity');
        } else {
          // General quality bonus
          if (prod.tier === 'S') score += 12;
          else if (prod.tier === 'A') score += 8;
        }
      }

      // Cap and normalize score
      const matchPercentage = Math.min(99, Math.max(70, Math.round(75 + (score / 175) * 24)));

      return {
        product: prod,
        score,
        matchPercentage,
        reasons: reasons.slice(0, 3)
      };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 4);
  }, [isCalculated, answers, products]);

  const topMatch = recommendations[0];
  const runnerUps = recommendations.slice(1, 4);

  return (
    <div className="fragrance-diagnostic-page" style={{ minHeight: '80vh', padding: '40px 0 80px', background: '#fafafa' }}>
      <div className="container" style={{ maxWidth: '900px' }}>

        {!isCalculated ? (
          /* ================= QUESTIONNAIRE STEPPER ================= */
          <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'clamp(20px, 4vw, 44px)', boxShadow: 'var(--shadow-sm)' }}>
            
            {/* Top Bar: Progress & Step Counter */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-black" style={{ fontSize: '0.68rem', letterSpacing: '0.1em' }}>
                  QUESTION {currentStep + 1} OF {QUESTIONS.length}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#926917', fontWeight: 700, fontFamily: 'var(--font-couture)', letterSpacing: '0.08em' }}>
                  VALENSZO DIAGNOSTIC
                </span>
              </div>

              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="btn-icon"
                  style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', border: 'none', background: 'transparent', color: '#6b7280', cursor: 'pointer' }}
                >
                  <ArrowLeft size={14} />
                  <span>Previous</span>
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '4px', background: '#e5e7eb', borderRadius: '2px', marginBottom: '32px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #000000 0%, #d97706 100%)',
                  width: `${((currentStep + 1) / QUESTIONS.length) * 100}%`,
                  transition: 'width 0.3s ease'
                }}
              />
            </div>

            {/* Question Header */}
            <div style={{ marginBottom: '28px', textAlign: 'left' }}>
              <h2 className="couture-title" style={{ fontSize: 'clamp(1.3rem, 3vw, 1.85rem)', marginBottom: '8px', color: '#000000', lineHeight: '1.25' }}>
                {currentQuestion.title}
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.92rem', lineHeight: '1.5' }}>
                {currentQuestion.subtitle}
              </p>
            </div>

            {/* Options Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id]?.id === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option)}
                    className="diagnostic-option-btn"
                    style={{
                      textAlign: 'left',
                      padding: '18px 20px',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected ? '2px solid #000000' : '1px solid #e5e7eb',
                      background: isSelected ? '#f8f9fa' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                        {option.label}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: '1.45' }}>
                        {option.desc}
                      </div>
                    </div>

                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: isSelected ? '7px solid #000000' : '2px solid #d1d5db',
                        flexShrink: 0,
                        transition: 'all 0.2s ease'
                      }}
                    />
                  </button>
                );
              })}
            </div>

          </div>
        ) : (
          /* ================= RECOMMENDATIONS VIEW ================= */
          <div>
            
            {/* Header Result Card */}
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div className="couture-sub" style={{ marginBottom: '6px', color: '#926917' }}>
                OLFACTORY DIAGNOSTIC COMPLETE
              </div>
              <h1 className="couture-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#000000', marginBottom: '12px' }}>
                Your Bespoke Scent Match
              </h1>
              <p style={{ color: '#4b5563', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                Based on your 10 preferences, our algorithm evaluated all <strong>345 creations</strong> in the Valenszo portfolio to discover your exact olfactory signature.
              </p>
            </div>

            {/* TOP #1 SIGNATURE MATCH HERO CARD */}
            {topMatch && (
              <div 
                style={{
                  background: '#ffffff',
                  border: '2px solid #000000',
                  borderRadius: 'var(--radius-md)',
                  padding: 'clamp(20px, 4vw, 36px)',
                  marginBottom: '40px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Gold Glow Top Ribbon */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #d97706, #f59e0b, #d97706)' }} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
                  
                  {/* Left Column: Product Visual with Match Badge */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ aspectRatio: '1', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#f3f4f6' }}>
                      <img
                        src={topMatch.product.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&auto=format&fit=crop&q=80'}
                        alt={topMatch.product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Floating Match Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: '#000000',
                        color: '#f59e0b',
                        border: '1px solid #d97706',
                        padding: '4px 10px',
                        borderRadius: '2px',
                        fontSize: '0.74rem',
                        fontWeight: 900,
                        letterSpacing: '0.08em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Sparkles size={13} />
                      <span>{topMatch.matchPercentage}% MATCH &bull; PERFECT SIGNATURE</span>
                    </div>

                    <div
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        color: '#111827',
                        padding: '4px 8px',
                        borderRadius: '2px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      CATALOG NO. {topMatch.product.catalogNo}
                    </div>
                  </div>

                  {/* Right Column: Matched Details & Fast Add to Bag */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="badge badge-black" style={{ fontSize: '0.66rem' }}>
                        {topMatch.product.tier === 'S' ? '★ TIER S LAUNCH ICON' : `TIER ${topMatch.product.tier}`}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {topMatch.product.gender} &bull; {topMatch.product.concentration}
                      </span>
                    </div>

                    <h2 className="couture-title" style={{ fontSize: '1.8rem', color: '#000000', marginBottom: '4px' }}>
                      {topMatch.product.displayName || topMatch.product.name}
                    </h2>

                    {topMatch.product.brandInspiration && (
                      <div style={{ fontSize: '0.85rem', color: '#926917', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '12px' }}>
                        Inspired by {topMatch.product.brandInspiration}
                      </div>
                    )}

                    <p style={{ color: '#4b5563', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '16px' }}>
                      {topMatch.product.tagline || topMatch.product.description}
                    </p>

                    {/* Reasons Why It Matched */}
                    <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-sm)', padding: '14px', marginBottom: '20px' }}>
                      <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-couture)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111827', marginBottom: '8px' }}>
                        Why this formula matches your chemistry:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {topMatch.reasons.map((reason, rIdx) => (
                          <div key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#374151' }}>
                            <CheckCircle2 size={14} color="#059669" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Size Selector */}
                    <div style={{ marginBottom: '18px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: '8px' }}>
                        Select Format
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {topMatch.product.sizes?.map((size, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => setSelectedSizeIndex(sIdx)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: 'var(--radius-sm)',
                              border: selectedSizeIndex === sIdx ? '2px solid #000000' : '1px solid #e5e7eb',
                              background: selectedSizeIndex === sIdx ? '#000000' : '#ffffff',
                              color: selectedSizeIndex === sIdx ? '#ffffff' : '#111827',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {size.label} &bull; ${(topMatch.product.price * size.priceMultiplier).toFixed(2)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-dior-black"
                        onClick={() => {
                          const chosenSize = topMatch.product.sizes?.[selectedSizeIndex] || { label: '100 ml Flacon', priceMultiplier: 1.0 };
                          addToCart(topMatch.product, chosenSize.label, chosenSize.priceMultiplier);
                        }}
                        style={{ flex: 1, minWidth: '180px', padding: '13px 20px', fontSize: '0.84rem' }}
                      >
                        <ShoppingBag size={15} />
                        <span>Add Signature To Bag</span>
                      </button>

                      <button
                        className="btn btn-dior-white"
                        onClick={() => setSelectedProductModal(topMatch.product)}
                        style={{ padding: '13px 18px', fontSize: '0.84rem' }}
                      >
                        <Eye size={15} />
                        <span>Inspect Notes</span>
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* CURATED RUNNER-UPS / ALTERNATIVES */}
            {runnerUps.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
                  <div>
                    <div className="couture-sub" style={{ marginBottom: '4px' }}>
                      ALTERNATIVE DISCOVERIES
                    </div>
                    <h3 className="couture-title" style={{ fontSize: '1.4rem', color: '#000000' }}>
                      Other Exceptional Matches
                    </h3>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
                  {runnerUps.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: 'var(--radius-sm)',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        {/* Image & Match Tag */}
                        <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '12px', background: '#f3f4f6' }}>
                          <img
                            src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&auto=format&fit=crop&q=80'}
                            alt={item.product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '8px',
                              left: '8px',
                              background: '#000000',
                              color: '#f59e0b',
                              padding: '2px 8px',
                              borderRadius: '2px',
                              fontSize: '0.64rem',
                              fontWeight: 800
                            }}
                          >
                            {item.matchPercentage}% MATCH
                          </div>
                        </div>

                        <div style={{ fontSize: '0.68rem', color: '#926917', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
                          {item.product.brandInspiration ? `Inspired by ${item.product.brandInspiration}` : item.product.category}
                        </div>

                        <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#111827', marginBottom: '6px', lineHeight: '1.3' }}>
                          {item.product.displayName || item.product.name}
                        </h4>

                        <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '12px', lineHeight: '1.4' }}>
                          {item.reasons[0] || item.product.tagline}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #f3f4f6' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#000000' }}>
                          ${item.product.price.toFixed(2)}
                        </div>

                        <button
                          className="btn btn-dior-black"
                          onClick={() => addToCart(item.product)}
                          style={{ padding: '7px 14px', fontSize: '0.74rem' }}
                        >
                          <ShoppingBag size={12} />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions: Retake or Browse Full Catalog */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginTop: '20px' }}>
              <button
                className="btn btn-dior-white"
                onClick={handleRestart}
                style={{ padding: '12px 24px', fontSize: '0.82rem' }}
              >
                <RotateCcw size={14} />
                <span>Retake Diagnostic</span>
              </button>

              <button
                className="btn btn-dior-black"
                onClick={() => navigateToCatalog('All Creations')}
                style={{ padding: '12px 28px', fontSize: '0.82rem' }}
              >
                <span>Browse Full 345 Portfolio</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
