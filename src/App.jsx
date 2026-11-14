import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // --- LOCALSTORAGE VERİ BAŞLATMA ---
  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem('fittrack_meals');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: 'Yulaf, Whey Protein & Süt',
            category: 'Kahvaltı',
            protein: 38,
            carbs: 45,
            fat: 8,
            calories: 404,
          },
          {
            id: 2,
            name: 'Izgara Tavuk Göğsü & Pirinç Pilavı',
            category: 'Öğle/Akşam',
            protein: 45,
            carbs: 60,
            fat: 6,
            calories: 474,
          },
        ];
  });

  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem('fittrack_workouts');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            exercise: 'Hip Thrust',
            split: 'Alt Vücut',
            sets: 4,
            reps: 10,
            weight: 80,
            completed: true,
          },
          {
            id: 2,
            exercise: 'Romanian Deadlift (RDL)',
            split: 'Alt Vücut',
            sets: 4,
            reps: 10,
            weight: 60,
            completed: false,
          },
          {
            id: 3,
            exercise: 'Shoulder Press',
            split: 'Üst Vücut',
            sets: 3,
            reps: 12,
            weight: 25,
            completed: false,
          },
        ];
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('fittrack_goals');
    return saved
      ? JSON.parse(saved)
      : { calories: 2100, protein: 140, carbs: 210, fat: 65 };
  });

  // --- FORM STATE'LERİ ---
  const [mealForm, setMealForm] = useState({
    name: '',
    category: 'Kahvaltı',
    protein: '',
    carbs: '',
    fat: '',
  });

  const [workoutForm, setWorkoutForm] = useState({
    exercise: '',
    split: 'Alt Vücut',
    sets: '',
    reps: '',
    weight: '',
  });

  const [showGoalModal, setShowGoalModal] = useState(false);

  // --- LOCALSTORAGE KAYIT EFEKTLERİ ---
  useEffect(() => {
    localStorage.setItem('fittrack_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('fittrack_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('fittrack_goals', JSON.stringify(goals));
  }, [goals]);

  // --- MAKRO HESAPLAMALARI ---
  const totalProtein = meals.reduce((acc, m) => acc + Number(m.protein), 0);
  const totalCarbs = meals.reduce((acc, m) => acc + Number(m.carbs), 0);
  const totalFat = meals.reduce((acc, m) => acc + Number(m.fat), 0);
  const totalCalories = meals.reduce((acc, m) => acc + Number(m.calories), 0);

  const totalVolume = workouts.reduce(
    (acc, w) => acc + Number(w.sets) * Number(w.reps) * Number(w.weight),
    0
  );

  // --- ÖĞÜN EKLEME & SİLME ---
  const handleAddMeal = (e) => {
    e.preventDefault();
    if (!mealForm.name) return;

    const p = Number(mealForm.protein) || 0;
    const c = Number(mealForm.carbs) || 0;
    const f = Number(mealForm.fat) || 0;
    // 1g Protein = 4 kcal, 1g Karb = 4 kcal, 1g Yağ = 9 kcal
    const calculatedCalories = p * 4 + c * 4 + f * 9;

    const newMeal = {
      id: Date.now(),
      name: mealForm.name,
      category: mealForm.category,
      protein: p,
      carbs: c,
      fat: f,
      calories: calculatedCalories,
    };

    setMeals([newMeal, ...meals]);
    setMealForm({ name: '', category: 'Kahvaltı', protein: '', carbs: '', fat: '' });
  };

  const handleDeleteMeal = (id) => {
    setMeals(meals.filter((m) => m.id !== id));
  };

  // --- ANTRENMAN EKLEME, DURUM DEĞİŞTİRME & SİLME ---
  const handleAddWorkout = (e) => {
    e.preventDefault();
    if (!workoutForm.exercise) return;

    const newWorkout = {
      id: Date.now(),
      exercise: workoutForm.exercise,
      split: workoutForm.split,
      sets: Number(workoutForm.sets) || 1,
      reps: Number(workoutForm.reps) || 1,
      weight: Number(workoutForm.weight) || 0,
      completed: false,
    };

    setWorkouts([newWorkout, ...workouts]);
    setWorkoutForm({ exercise: '', split: 'Alt Vücut', sets: '', reps: '', weight: '' });
  };

  const toggleWorkoutStatus = (id) => {
    setWorkouts(
      workouts.map((w) => (w.id === id ? { ...w, completed: !w.completed } : w))
    );
  };

  const handleDeleteWorkout = (id) => {
    setWorkouts(workouts.filter((w) => w.id !== id));
  };

  // --- ROZET RENKLERİ ---
  const getSplitBadge = (split) => {
    switch (split) {
      case 'Alt Vücut':
        return 'bg-danger';
      case 'Üst Vücut':
        return 'bg-primary';
      case 'Kardiyo & Kondisyon':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  const getMealBadge = (cat) => {
    switch (cat) {
      case 'Kahvaltı':
        return 'bg-warning text-dark';
      case 'Öğle/Akşam':
        return 'bg-info text-dark';
      case 'Antrenman Sonrası':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  const getPercentage = (current, target) =>
    Math.min(Math.round((current / target) * 100), 100);

  return (
    <div className="container py-4">
      {/* ÜST BAŞLIK */}
      <header className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary">
        <div>
          <h2 className="fw-bold mb-0 text-white">
            <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
            FitMacro Tracker
          </h2>
          <small className="text-secondary">
            Günlük Antrenman Hacmi ve Beslenme Makro Takip Sistemi
          </small>
        </div>
        <div className="d-flex gap-2 mt-2 mt-md-0">
          <button
            className="btn btn-outline-info btn-sm"
            onClick={() => setShowGoalModal(!showGoalModal)}
          >
            <i className="bi bi-sliders me-1"></i> Hedefleri Düzenle
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              if (window.confirm('Tüm günlük kayıtları sıfırlamak istiyor musun?')) {
                setMeals([]);
                setWorkouts([]);
              }
            }}
          >
            <i className="bi bi-trash3 me-1"></i> Günü Sıfırla
          </button>
        </div>
      </header>

      {/* HEDEF DÜZENLEME PANELİ */}
      {showGoalModal && (
        <div className="custom-card p-3 mb-4 border-info">
          <h6 className="text-info mb-3">
            <i className="bi bi-bullseye me-2"></i>Günlük Makro Hedeflerini Güncelle
          </h6>
          <div className="row g-2">
            <div className="col-6 col-md-3">
              <label className="small text-secondary">Hedef Kalori (kcal)</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={goals.calories}
                onChange={(e) => setGoals({ ...goals, calories: Number(e.target.value) })}
              />
            </div>
            <div className="col-6 col-md-3">
              <label className="small text-secondary">Protein (g)</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={goals.protein}
                onChange={(e) => setGoals({ ...goals, protein: Number(e.target.value) })}
              />
            </div>
            <div className="col-6 col-md-3">
              <label className="small text-secondary">Karbonhidrat (g)</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={goals.carbs}
                onChange={(e) => setGoals({ ...goals, carbs: Number(e.target.value) })}
              />
            </div>
            <div className="col-6 col-md-3">
              <label className="small text-secondary">Yağ (g)</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={goals.fat}
                onChange={(e) => setGoals({ ...goals, fat: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>
      )}

      {/* ÜST ÖZET KARTLARI (DASHBOARD) */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="stat-card p-3">
            <div className="d-flex justify-content-between">
              <span className="text-secondary small">Kalori</span>
              <span className="badge bg-warning text-dark">
                %{getPercentage(totalCalories, goals.calories)}
              </span>
            </div>
            <h4 className="fw-bold my-1">
              {totalCalories} <small className="fs-6 text-secondary">/ {goals.calories} kcal</small>
            </h4>
            <div className="progress mt-2">
              <div
                className="progress-bar bg-warning"
                style={{ width: `${getPercentage(totalCalories, goals.calories)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="stat-card p-3">
            <div className="d-flex justify-content-between">
              <span className="text-secondary small">Protein</span>
              <span className="badge bg-info text-dark">
                %{getPercentage(totalProtein, goals.protein)}
              </span>
            </div>
            <h4 className="fw-bold my-1">
              {totalProtein}g <small className="fs-6 text-secondary">/ {goals.protein}g</small>
            </h4>
            <div className="progress mt-2">
              <div
                className="progress-bar bg-info"
                style={{ width: `${getPercentage(totalProtein, goals.protein)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="stat-card p-3">
            <div className="d-flex justify-content-between">
              <span className="text-secondary small">Karbonhidrat & Yağ</span>
              <span className="badge bg-success">Makro</span>
            </div>
            <h5 className="fw-bold my-1">
              K: {totalCarbs}g <span className="text-secondary">|</span> Y: {totalFat}g
            </h5>
            <div className="progress mt-2">
              <div
                className="progress-bar bg-success"
                style={{ width: `${getPercentage(totalCarbs, goals.carbs)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="stat-card p-3">
            <div className="d-flex justify-content-between">
              <span className="text-secondary small">Antrenman Hacmi</span>
              <span className="badge bg-primary">
                {workouts.filter((w) => w.completed).length}/{workouts.length} الحركة
              </span>
            </div>
            <h4 className="fw-bold my-1">
              {totalVolume.toLocaleString()} <small className="fs-6 text-secondary">kg</small>
            </h4>
            <small className="text-secondary" style={{ fontSize: '0.75rem' }}>
              Toplam (Set x Tekrar x Ağırlık)
            </small>
          </div>
        </div>
      </div>

      {/* ANA İÇERİK: SOL (MAKROLAR) & SAĞ (ANTRENMAN) */}
      <div className="row g-4">
        {/* SOL SÜTUN: MAKRO VE ÖĞÜN TAKİBİ */}
        <div className="col-lg-6">
          <div className="custom-card p-4 h-100">
            <h5 className="fw-bold mb-3 text-info">
              <i className="bi bi-egg-fried me-2"></i>Öğün & Makro Ekle
            </h5>

            <form onSubmit={handleAddMeal} className="mb-4">
              <div className="row g-2">
                <div className="col-md-7">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Besin / Öğün adı (Örn: Yulaf & Whey)"
                    value={mealForm.name}
                    onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-5">
                  <select
                    className="form-select"
                    value={mealForm.category}
                    onChange={(e) => setMealForm({ ...mealForm, category: e.target.value })}
                  >
                    <option value="Kahvaltı">Kahvaltı</option>
                    <option value="Öğle/Akşam">Öğle/Akşam</option>
                    <option value="Antrenman Sonrası">Antrenman Sonrası</option>
                    <option value="Ara Öğün">Ara Öğün</option>
                  </select>
                </div>
                <div className="col-4">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Protein (g)"
                    min="0"
                    value={mealForm.protein}
                    onChange={(e) => setMealForm({ ...mealForm, protein: e.target.value })}
                    required
                  />
                </div>
                <div className="col-4">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Karb (g)"
                    min="0"
                    value={mealForm.carbs}
                    onChange={(e) => setMealForm({ ...mealForm, carbs: e.target.value })}
                    required
                  />
                </div>
                <div className="col-4">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Yağ (g)"
                    min="0"
                    value={mealForm.fat}
                    onChange={(e) => setMealForm({ ...mealForm, fat: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12 mt-2">
                  <button type="submit" className="btn btn-info w-100 fw-semibold">
                    <i className="bi bi-plus-circle me-1"></i> Öğünü Kaydet (Kalori Otomatik)
                  </button>
                </div>
              </div>
            </form>

            <h6 className="text-secondary mb-2">Günlük Beslenme Kayıtları</h6>
            <div className="table-responsive">
              <table className="table table-dark-custom table-hover align-middle mb-0">
                <thead>
                  <tr className="text-secondary small">
                    <th>Öğün</th>
                    <th>Kategori</th>
                    <th>P / K / Y (g)</th>
                    <th>Kalori</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {meals.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-secondary py-3">
                        Henüz öğün eklenmedi.
                      </td>
                    </tr>
                  ) : (
                    meals.map((meal) => (
                      <tr key={meal.id}>
                        <td className="fw-semibold">{meal.name}</td>
                        <td>
                          <span className={`badge ${getMealBadge(meal.category)}`}>
                            {meal.category}
                          </span>
                        </td>
                        <td className="small">
                          <span className="text-info">{meal.protein}P</span> /{' '}
                          <span className="text-success">{meal.carbs}K</span> /{' '}
                          <span className="text-warning">{meal.fat}Y</span>
                        </td>
                        <td className="fw-bold text-warning">{meal.calories} kcal</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-danger border-0"
                            onClick={() => handleDeleteMeal(meal.id)}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SAĞ SÜTUN: ANTRENMAN TAKİBİ */}
        <div className="col-lg-6">
          <div className="custom-card p-4 h-100">
            <h5 className="fw-bold mb-3 text-primary">
              <i className="bi bi-activity me-2"></i>Antrenman Hareketi Ekle
            </h5>

            <form onSubmit={handleAddWorkout} className="mb-4">
              <div className="row g-2">
                <div className="col-md-7">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Hareket adı (Örn: Bulgarian Split Squat)"
                    value={workoutForm.exercise}
                    onChange={(e) =>
                      setWorkoutForm({ ...workoutForm, exercise: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-5">
                  <select
                    className="form-select"
                    value={workoutForm.split}
                    onChange={(e) =>
                      setWorkoutForm({ ...workoutForm, split: e.target.value })
                    }
                  >
                    <option value="Alt Vücut">Alt Vücut (Lower)</option>
                    <option value="Üst Vücut">Üst Vücut (Upper)</option>
                    <option value="Kardiyo & Kondisyon">Kardiyo & Kondisyon</option>
                  </select>
                </div>
                <div className="col-4">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Set"
                    min="1"
                    value={workoutForm.sets}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, sets: e.target.value })}
                    required
                  />
                </div>
                <div className="col-4">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Tekrar"
                    min="1"
                    value={workoutForm.reps}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, reps: e.target.value })}
                    required
                  />
                </div>
                <div className="col-4">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Ağırlık (kg)"
                    min="0"
                    value={workoutForm.weight}
                    onChange={(e) =>
                      setWorkoutForm({ ...workoutForm, weight: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-12 mt-2">
                  <button type="submit" className="btn btn-primary w-100 fw-semibold">
                    <i className="bi bi-plus-circle me-1"></i> Hareketi Programa Ekle
                  </button>
                </div>
              </div>
            </form>

            <h6 className="text-secondary mb-2">Antrenman Programı</h6>
            <div className="table-responsive">
              <table className="table table-dark-custom table-hover align-middle mb-0">
                <thead>
                  <tr className="text-secondary small">
                    <th>Durum</th>
                    <th>Hareket</th>
                    <th>Bölge</th>
                    <th>Set x Tekrar</th>
                    <th>Ağırlık</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-secondary py-3">
                        Henüz antrenman hareketi eklenmedi.
                      </td>
                    </tr>
                  ) : (
                    workouts.map((w) => (
                      <tr key={w.id} className={w.completed ? 'completed-row' : ''}>
                        <td>
                          <button
                            className={`btn btn-sm ${
                              w.completed ? 'btn-success' : 'btn-outline-secondary'
                            }`}
                            onClick={() => toggleWorkoutStatus(w.id)}
                          >
                            <i className="bi bi-check2"></i>
                          </button>
                        </td>
                        <td className="fw-semibold">{w.exercise}</td>
                        <td>
                          <span className={`badge ${getSplitBadge(w.split)}`}>{w.split}</span>
                        </td>
                        <td>
                          {w.sets} x {w.reps}
                        </td>
                        <td className="fw-bold text-info">{w.weight} kg</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-danger border-0"
                            onClick={() => handleDeleteWorkout(w.id)}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;