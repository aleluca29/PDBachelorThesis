import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { UserContext } from '../contexts/UserContext';

const colors = {
  primary: '#6F1D1B',
  secondary: '#E7B18D',
  background: '#F6DFB7',
  textDark: '#432C18',
  textLight: '#E7D1B1',
  white: '#FFFFFF',
  black: '#000000',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 120,
    paddingBottom: 100,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  contentText: {
    fontSize: 16,
    color: colors.primary,
    lineHeight: 24,
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginTop: 20,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  ellipsesContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
  },
  ellipse: {
    position: 'absolute',
    width: 100,
    height: 90,
    resizeMode: 'contain',
  },
  secondEllipsePosition: {
    top: 0,
    right: -10,
    width: 120,
    height: 120,
    resizeMode: 'contain',
    opacity: 0.8,
  },
  avatarTouchable: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    zIndex: 1,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 25,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  linkText: {
    color: '#1e90ff',
    marginTop: 20,
    textAlign: 'center',
  },
});

const TopicDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { title } = route.params;
  const { avatarUri } = useContext(UserContext);

  const getContent = () => {
    switch (title) {
      case 'Learn More About Parkinson’s Disease':
        return (
          <>
            <Text style={styles.contentText}>
              A neurodegenerative disorder that affects predominately the dopamine-producing (“dopaminergic”) neurons in a specific area of the brain called substantia nigra.
              Parkinson’s disease (PD) impacts people in different ways. Not everyone will experience all the symptoms of PD; even if people do, they won’t necessarily experience the symptoms in quite the same order or at the same intensity.
            </Text>
            <Text style={styles.contentText}>
              While symptoms and disease progression are unique to each person, knowing the typical stages of Parkinson’s can help you cope with changes as they occur. Some people experience the changes over 20 years or more. Others find the disease progresses more quickly.
            </Text>
            <Text style={styles.contentText}>
              It is difficult to accurately predict the progression of Parkinson’s. Following a diagnosis, many people experience a good response to medications, such as levodopa. This optimal timeframe can last many years and varies for everyone.
            </Text>
            <Text style={styles.contentText}>
              However, as the disease progresses, people with Parkinson’s often need to work alongside their doctor to adjust levodopa dosages. In this timeframe, they may experience new or worsening movement symptoms and fluctuations, levodopa-induced dyskinesia, swallowing problems, freezing of gait, falls and imbalance.
            </Text>
            <Text style={styles.contentText}>
              People with young-onset PD are more prone to levodopa-induced dyskinesia and changes in movement (called motor fluctuations), while those diagnosed later in age may experience more cognitive changes and non-movement symptoms.
            </Text>
            <Text style={styles.contentText}>
              Motor fluctuations can become an issue five to 10 years after diagnosis. Postural instability (trouble with balance and falls) typically occurs after about 10 years.
            </Text>
            <Text style={styles.subHeader}>5 Stages</Text>
            <Text style={styles.contentText}>
              In 1967, Hoehn & Yahr defined five stages of PD based on the level of clinical disability. Clinicians use it to describe how motor symptoms progress in PD. On this scale, stages 1 and 2 represent early-stage, 2 and 3 mid-stage, and 4 and 5 advanced-stage PD.
            </Text>
            <Text style={styles.subHeader}>Stage One</Text>
            <Text style={styles.contentText}>
              During this initial stage, the person has mild symptoms that generally do not interfere with daily activities. Tremor and other movement symptoms occur on one side of the body only. Changes in posture, walking and facial expressions occur.
            </Text>
            <Text style={styles.subHeader}>Stage Two</Text>
            <Text style={styles.contentText}>
              Symptoms start getting worse. Tremor, rigidity and other movement symptoms affect both sides of the body or the midline (such as the neck and the trunk). Walking problems and poor posture may be apparent. The person is able to live alone, but daily tasks are more difficult and lengthier.
            </Text>
            <Text style={styles.subHeader}>Stage Three</Text>
            <Text style={styles.contentText}>
              Considered mid-stage, loss of balance (such as unsteadiness as the person turns or when he/she is pushed from standing) is the hallmark. Falls are more common. Motor symptoms continue to worsen. Functionally the person is somewhat restricted in his/her daily activities now, but is still physically capable of leading an independent life. Disability is mild to moderate at this stage.
            </Text>
            <Text style={styles.subHeader}>Stage Four</Text>
            <Text style={styles.contentText}>
              At this point, symptoms are fully developed and severely disabling. The person is still able to walk and stand without assistance, but may need to ambulate with a cane/walker for safety. The person needs significant help with activities of daily living and is unable to live alone.
            </Text>
            <Text style={styles.subHeader}>Stage Five</Text>
            <Text style={styles.contentText}>
              This is the most advanced and debilitating stage. Stiffness in the legs may make it impossible to stand or walk. The person is bedridden or confined to a wheelchair unless aided. Around-the-clock care is required for all activities.
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.parkinson.org')}>
              <Text style={styles.linkText}>Source: Parkinson's Foundation</Text>
            </TouchableOpacity>
          </>
        );
      case 'Symptoms of Parkinson’s Disease':
        return (
          <>
            <Text style={styles.contentText}>
              It can be hard to tell if you or a loved one has Parkinson's disease (PD).
            </Text>
            <Text style={styles.contentText}>
              Below are 10 signs that you might have the disease. No single one of these signs means that you should worry, but if you have more than one sign you should consider making an appointment to talk to your doctor
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.subHeader}>1. Tremor</Text>
                {'\n'}Have you noticed a slight shaking or tremor in your finger, thumb, hand or chin? A tremor while at rest is a common early sign of Parkinson's disease.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.boldText}>What is normal?</Text>  Shaking can be normal after lots of exercise, if you are stressed or if you have been injured. Shaking could also be caused by a medicine you take.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.subHeader}>2. Small Handwriting</Text>
              {'\n'}Has your handwriting gotten much smaller than it was in the past? You may notice the way you write words on a page has changed, such as letter sizes are smaller and the words are crowded together. A change in handwriting may be a sign of Parkinson's disease called micrographia.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.boldText}>What is normal?</Text>  Sometimes writing can change as you get older, if you have stiff hands or fingers or poor vision.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.subHeader}>3. Loss of Smell</Text>
              {'\n'}Have you noticed you no longer smell certain foods very well? If you seem to have more trouble smelling foods like bananas, dill pickles or licorice, you should ask your doctor about Parkinson's.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.boldText}>What is normal?</Text>  Your sense of smell can be changed by a cold, flu or a stuffy nose, but it should come back when you are better.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.subHeader}>4. Trouble Sleeping</Text>
              {'\n'}Do you thrash around in bed or act out dreams when you are deeply asleep? Sometimes, your spouse will notice or will want to move to another bed. Sudden movements during sleep may be a sign of Parkinson's disease.
            </Text>
            <Text style={styles.contentText}>
             <Text style={styles.boldText}>What is normal?</Text>  It is normal for everyone to have a night when they 'toss and turn' instead of sleeping. Similarly, quick jerks of the body when initiating sleep or when in lighter sleep are common and often normal.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.subHeader}>5. Trouble Moving or Walking</Text>
              {'\n'}Do you feel stiff in your body, arms or legs? Have others noticed that your arms don’t swing like they used to when you walk? Sometimes stiffness goes away as you move. If it does not, it can be a sign of Parkinson's disease. An early sign might be stiffness or pain in your shoulder or hips. People sometimes say their feet seem “stuck to the floor.”
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.boldText}>What is normal?</Text>  If you have injured your arm or shoulder, you may not be able to use it as well until it is healed, or another illness like arthritis might cause the same symptom.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.subHeader}>6. Constipation</Text>
              {'\n'}Do you have trouble moving your bowels without straining every day? Straining to move your bowels can be an early sign of Parkinson's disease and you should talk to your doctor.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.boldText}>What is normal?</Text>  If you do not have enough water or fiber in your diet, it can cause problems in the bathroom. Also, some medicines, especially those used for pain, will cause constipation. If there is no other reason such as diet or medicine that would cause you to have trouble moving your bowels, you should speak with your doctor.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.subHeader}>7. A Soft or Low Voice</Text>
              {'\n'}Have other people told you that your voice is very soft or that you sound breathy and/or hoarse? If there has been a change in your voice you should see your doctor about whether it could be Parkinson's disease. Sometimes you might think other people are losing their hearing, when really you are speaking more softly.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.boldText}>What is normal?</Text>  A chest cold or other virus can cause your voice to sound different, but you should go back to sounding the same when you get over your cough or cold.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.subHeader}>8. Masked Face</Text>
              {'\n'}Have you been told that you have a serious, depressed or mad look on your face, even when you are not in a bad mood? This is often called facial masking. If so, you should ask your doctor about Parkinson's disease.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.boldText}>What is normal?</Text>  Some medicines can cause you to have the same type of serious or staring look, but you would go back to the way you were after you stopped the medication.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.subHeader}>9. Dizziness or Fainting</Text>
              {'\n'}Do you notice that you often feel dizzy when you stand up out of a chair? Feeling dizzy or fainting can be a sign of low blood pressure and can be linked to Parkinson's disease.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.boldText}>What is normal?</Text>  Everyone has had a time when they stood up and felt dizzy, but if it happens on a regular basis you should see your doctor.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.subHeader}>10. Stooping or Hunching Over</Text>
              {'\n'}Are you not standing up as straight as you used to? If you or your family or friends notice that you seem to be stooping, leaning or slouching when you stand, it could be a sign of Parkinson's disease.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.boldText}>What is normal?</Text>  If you have pain from an injury or if you are sick, it might cause you to stand crookedly. Also, a problem with your bones can make you hunch over.
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.parkinson.org')}>
              <Text style={styles.linkText}>Source: Parkinson's Foundation</Text>
            </TouchableOpacity>
          </>
        );
      case 'Treatments for Parkinson’s Disease':
        return (
          <>
            <Text style={styles.contentText}>
              There is no one-size-fits all treatment for Parkinson’s. Rather, treatment should be tailored to an individual’s symptoms via a shared decision-making process with your healthcare provider.
            </Text>
            <Text style={styles.contentText}>
              Treatment may include things that you do yourself, such as exercise, or things that you do with oversight, such as physical therapy, occupational therapy, and speech therapy or talk therapy. It may also include medications specific to your needs, such as medications aimed at improving your movement, and others aimed at improving non-movement symptoms such as constipation, urinary dysfunction, or sleep. The treatment of Parkinson’s is often best served via a team approach, with you – the person with PD – at the center and incorporation of your care partner, healthcare provider, therapists and other healthcare providers who treat specific symptoms of Parkinson’s.
            </Text>
            <Text style={styles.subHeader}>Exercise</Text>
            <Text style={styles.contentText}>
              Exercise is an important part of healthy living for everyone. For those with Parkinson’s disease (PD), exercise is more than healthy — it is a vital component to maintaining balance, mobility and activities of daily living. Research shows that exercise and physical activity can not only maintain and improve mobility, flexibility and balance but also ease non-motor PD symptoms such as depression or constipation.
            </Text>
            <Text style={styles.contentText}>
              There is no “exercise prescription” that is right for every person with PD. The type of exercise you do depends on your symptoms and challenges. For those who may be more sedentary, starting with low intensity exercise, such as walking, is beneficial. This can be increased to regular, more vigorous activity as tolerated.
            </Text>
            <Text style={styles.contentText}>
              The most important thing is to do the exercise regularly. We suggest finding an exercise you enjoy and can stick with!
            </Text>
            <Text style={styles.subHeader}>Working Out with a Partner</Text>
            <Text style={styles.contentText}>
              Many people find that they achieve the most success when exercising with a partner. Depending on the stage of the disease, it may be best for people with PD to train in an environment where others who could offer help are available if needed.
            </Text>
            <Text style={styles.contentText}>
              A workout partners can help motivate and engage one another in their exercise. People new to exercise programs may benefit with training with an individual or group leader. A physical therapist may be helpful in starting a program for people whose mobility is significantly affected by PD.
            </Text>
            <Text style={styles.subHeader}>Exercise Tips</Text>
            <Text style={styles.contentText}>
             • The best way to see benefits is to exercise on a consistent basis. People with PD enrolled in exercise programs with durations longer than six months, regardless of exercise intensity, showed significant gains in functional balance and mobility as compared to two-week or 10-week programs.
            </Text>
            <Text style={styles.contentText}>
             • When it comes to exercise and PD, greater intensity may have greater benefits. Experts recommend that people with PD, particularly young-onset or those in the early stages, exercise with intensity for as long as possible as often as possible. The more you do, the more you benefit.
            </Text>
            <Text style={styles.contentText}>
             • Intense exercise is exercise that raises your heart rate and makes you breathe heavily. Studies have focused on running and bicycle riding, but experts feel that other intense exercise such as swimming should provide the same benefit.
            </Text>
            <Text style={styles.contentText}>
             • Regardless of your condition, always stretch, warm up and cool down properly.
            </Text>
            <Text style={styles.contentText}>
             • Exercise in a way that is safe for you. Know your limits.
            </Text>
            <Text style={styles.contentText}>
             • Many support groups, therapists and exercise programs can help with PD-safe exercises or help you set up your own program.
            </Text>
            <Text style={styles.subHeader}>Challenges to Exercising</Text>
            <Text style={styles.contentText}>
              People in the early stages of PD tend to be just as strong and physically fit as healthy individuals of the same age. As Parkinson’s progresses, it can lead to the following physical changes:
            </Text>
            <Text style={styles.contentText}>
              • Loss of joint flexibility, which can affect balance.
            </Text>
            <Text style={styles.contentText}>
              • Decreased muscle strength or deconditioning which can affect walking and the ability to stand up from sitting.
            </Text>
            <Text style={styles.contentText}>
              • Decline in cardiovascular conditioning, which affects endurance.
            </Text>
            <Text style={styles.subHeader}>Medication</Text>
            <Text style={styles.contentText}>
              Although there are general guidelines that doctors use to choose a treatment regimen, each person with Parkinson’s disease (PD) must be individually evaluated to determine which drug or combination of medications is best for them. For some, a “first choice” drug might be a form of levodopa, and for others, an initial prescription may be given for one of the dopamine agonists, an MAO inhibitor, or an anticholinergic.
            </Text>
            <Text style={styles.contentText}>
              The choice of medication depends on many variables including your symptoms, other existing health issues (and the medications being used to treat them) and age. Dosages vary greatly depending on a person’s needs and metabolism.
            </Text>
            <Text style={styles.contentText}>
              Since most Parkinson’s symptoms are caused by a lack of dopamine in the brain, many Parkinson’s drugs are aimed at either temporarily replenishing dopamine or mimicking the action of dopamine. These types of drugs are called dopaminergic medications. They generally help reduce muscle rigidity, improve speed and coordination of movement, and lessen tremor.
            </Text>
            <Text style={styles.contentText}>
              Always remember that medication is only part of the overall treatment plan for combatting PD.
            </Text>
              <Text style={styles.contentText}>
              Talk to your doctor about available medications, but don’t forget exercise and complementary therapies.
            </Text>
            <Text style={styles.subHeader}>Caution</Text>
            <Text style={styles.contentText}>
              Parkinson’s medications may have interactions with certain foods, other medications, vitamins, herbal supplements, over-the-counter cold pills and other remedies. Anyone taking a PD medication should talk to their doctor and pharmacist about potential drug interactions.
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.parkinson.org')}>
              <Text style={styles.linkText}>Source: Parkinson's Foundation</Text>
            </TouchableOpacity>
          </>
        );
      case 'Fall Prevention in Parkinson’s Disease':
        return (
          <>
            <Text style={styles.contentText}>
              Around 60% of people with Parkinson’s disease (PD) fall every year. Some falls result in minor scrapes or bruises, but others can have a lasting impact on mobility and independence. Learning how PD affects balance and taking steps to lower your fall risk can maximize your safety and independence.
            </Text>
            <Text style={styles.subHeader}>Reasons for Falls in Parkinson's</Text>
            <Text style={styles.contentText}>
              Parkinson's changes the way people move, often causing challenges with balance, walking and posture that may lead to falls. Since PD affects each person differently, recognizing your unique challenges can help you identify ways to stay safe. Common reasons for falls in PD include:
            </Text>
            <Text style={styles.contentText}>• Walking changes: Shorter, slower or shuffling steps can affect balance or lead to tripping.</Text>
            <Text style={styles.contentText}>• Balance issues: Parkinson's disrupts some of the natural movements and reflexes that maintain upright posture and balance.</Text>
            <Text style={styles.contentText}>• Freezing: Described as feeling like the feet are stuck to the floor, freezing can be triggered by doorways, turns, stress or meds wearing off. Not everyone experiences this, but those who do are at a higher risk of falling.</Text>
            <Text style={styles.contentText}>• Low blood pressure: Parkinson's affects the autonomic system, which can cause drops in blood pressure, particularly when standing up. Symptoms of low blood pressure, such as fatigue, dizziness or lightheadedness, can impact balance.</Text>
            <Text style={styles.contentText}>• Medication side effects: Medications, including those prescribed for PD, can cause side effects like sleepiness and confusion, which can result in falls.</Text>
            <Text style={styles.contentText}>• Muscle weakness: PD symptoms can make it harder to keep moving, which can weaken leg and core muscles and impact balance. Fear of falling can add to this issue.</Text>
            <Text style={styles.contentText}>• Thinking changes: Parkinson's can affect focus, making multitasking — already challenging — even trickier. Walking while distracted may lead to falls.</Text>
            <Text style={styles.contentText}>• Vision and perception issues: Parkinson's can cause blurry or double vision and difficulty judging distances. These changes can affect spatial awareness and balance. Though not directly linked to PD, hearing loss can also affect balance.</Text>
            <Text style={styles.subHeader}>Are you at risk of falling?</Text>
                <Text style={styles.contentText}>• Have you fallen before? </Text>
                  <Text style={styles.contentText}>• Do you tend to trip? </Text>
                  <Text style={styles.contentText}>• Do you feel unsteady when walking? </Text>
                  <Text style={styles.contentText}>• Do you experience freezing episodes? </Text>
                  <Text style={styles.contentText}>• Do you ever feel dizzy, weak or fatigued? </Text>
                  <Text style={styles.contentText}>• Do you take medications that may affect balance? </Text>
                  <Text style={styles.contentText}>• If you depend on a mobility aid, like a walker, do you ever neglect to use it? </Text>
                  <Text style={styles.contentText}>• Do you make nighttime bathroom visits? </Text>
                  <Text style={styles.contentText}>• Do you take medications that may affect balance? </Text>
                  <Text style={styles.contentText}> If you answered yes to any of the questions above, talk to your doctor. You may be at risk of falling. </Text>

            <Text style={styles.subHeader}>Strategies for Improving Balance and Reducing Falls</Text>
            <Text style={styles.contentText}>
            <Text style={styles.boldText}>Start with your doctor to identify possible fall risks.</Text>
            </Text>
            <Text style={styles.contentText}>• Review medications. Your doctor can adjust medications to reduce fall risks or better manage PD symptoms.</Text>
            <Text style={styles.contentText}>• Check blood pressure. Medications and PD can lower blood pressure and may cause falls. Watch for orthostatic hypotension — a drop in blood pressure that happens when standing up. Talk to your doctor about strategies and medications.</Text>
            <Text style={styles.contentText}>• Screen for hearing and vision changes and other conditions that could affect movement or balance. Your doctor may refer you to specialists for further evaluation.</Text>
            <Text style={styles.contentText}>
                <Text style={styles.boldText}>  Stay active. </Text>
            </Text>
            <Text style={styles.contentText}>
              Regular exercise helps manage PD and may reduce falls. Before starting, ask your doctor for a referral to physical or occupational therapy for an evaluation and individualized exercises.
            </Text>

             <Text style={styles.contentText}> Physical and occupational therapists help you stay active with:</Text>
             <Text style={styles.contentText}>• Personalized exercises for balance and mobility.</Text>
             <Text style={styles.contentText}>• Strategies for PD challenges like freezing and short steps.</Text>
             <Text style={styles.contentText}>• Mobility aid suggestions like walking poles, canes or walkers.</Text>
              <Text style={styles.contentText}>• Home safety evaluations and modifications.</Text>
              <Text style={styles.contentText}>• Tips for maintaining daily activities.</Text>

            <Text style={styles.subHeader}>Make your home safe.</Text>
            <Text style={styles.contentText}>Remove tripping hazards like clutter, loose rugs and cords, install grab bars in the bathroom and add nightlights</Text>
            <Text style={styles.subHeader}> If a fall occurs:</Text>
              <Text style={styles.contentText}>• Stay calm.</Text>
              <Text style={styles.contentText}>• Scan for injuries and call for help if needed.</Text>
              <Text style={styles.contentText}>• Take your time and plan your moves before getting up.</Text>
              <Text style={styles.contentText}>• If able, crawl or scoot to a heavy piece of furniture for help getting up.</Text>

            <Text style={styles.subHeader}>Tips for Safer Movement</Text>
            <Text style={styles.contentText}>• Take your time with movements like sitting, standing or turning corners.</Text>
            <Text style={styles.contentText}>• Widen your stance and take bigger steps for more stability.</Text>
            <Text style={styles.contentText}>• Keep frequently used items within easy reach.</Text>
            <Text style={styles.contentText}>• Keep hands free and limit distractions and multitasking while walking.</Text>
            <Text style={styles.contentText}>• Consider using fall detection technology like a medical alert system.</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.parkinson.org')}>
              <Text style={styles.linkText}>Source: Parkinson's Foundation</Text>
            </TouchableOpacity>
          </>
        );
      case 'Getting Diagnosed of Parkinson’s Disease':
        return (
          <>
            <Text style={styles.contentText}>
              Parkinson’s disease (PD) is a “clinical” diagnosis. This means that an individual’s history, symptoms, and physical exam are used to make the diagnosis. There is not a specific lab or imaging test that can diagnose PD. However, certain tests such as magnetic resonance imaging of the brain (MRI brain), a dopamine transporter scan (DaT scan), or blood work can be used to support the diagnosis of PD or to rule out other medical conditions that can mimic PD.
            </Text>
            <Text style={styles.contentText}>
              Making an accurate diagnosis of Parkinson’s, particularly in its early stages, can be difficult. Often, an internist or family physician is the first to make a diagnosis. Many people may seek an additional opinion from a movement disorder specialist. A movement disorder specialist is a neurologist with experience and specific training in the assessment and treatment of PD and related disorders.
            </Text>
            <Text style={styles.contentText}>
              The newest criteria for diagnosing Parkinson’s was developed by the International Parkinson and Movement Disorder Society (MDS), and reflect the most current understanding of PD.
            </Text>
            <Text style={styles.contentText}>
              To consider a diagnosis of Parkinson’s disease, a person must have bradykinesia (slowness of movement). In addition to bradykinesia, a person must also have one or more of the following:
            </Text>
            <Text style={styles.contentText}>• Shaking or tremor in a limb that occurs while it is at rest</Text>
            <Text style={styles.contentText}>• Stiffness or rigidity of the arms, legs, or trunk</Text>
            <Text style={styles.contentText}>• Trouble with balance and falls</Text>
            <Text style={styles.subHeader}>Neurology Appointment</Text>
            <Text style={styles.contentText}>
              The first and most important diagnostic tool for Parkinson’s is a medical history and physical examination conducted by a neurologist.
            </Text>
            <Text style={styles.contentText}>
              A neurologist will make a diagnosis based on:
            </Text>
            <Text style={styles.contentText}>• A detailed history of symptoms, existing medical conditions, current and past medications, family history, and lifestyle factors. Certain medical conditions, as well as some medications, can cause symptoms similar to Parkinson’s.</Text>
            <Text style={styles.contentText}>• A detailed neurological examination during which a neurologist will ask you to perform tasks to assess the agility of arms and legs, muscle tone, gait and balance, to see if:</Text>
            <Text style={styles.contentText}>• Expression and speech are animated</Text>
            <Text style={styles.contentText}>• Tremor can be observed in your extremities at rest or in action</Text>
            <Text style={styles.contentText}>• There is stiffness in your extremities or neck</Text>
            <Text style={styles.contentText}>• There are changes to your walking, step size, and ability to turn</Text>
            <Text style={styles.contentText}>• You can maintain your balance and examine your posture</Text>
            <Text style={styles.contentText}>
              You may notice that a neurologist records your exam according to the Unified Parkinson’s Disease Rating Scale (UPDRS). This is a universal scale used by neurologists and movement disorder specialists to comprehensively assess and document the exam of a person with PD. This scale can be used as a baseline, to judge the effect of medication, and to track the progression of the disease during future visits.
            </Text>
            <Text style={styles.contentText}>
              In Parkinson’s disease, there is a loss of neurons that make the neurotransmitter dopamine. Your doctor may start a medication to help replace dopamine or increase its effect in the brain. These medications are known as dopaminergic medications. Most commonly, people with PD will see improvement in the speed of their movement, stiffness, or tremor when they start dopaminergic medications.
            </Text>
            <Text style={styles.contentText}>
              Lack of response to medications may prompt the doctor to seek an alternative diagnosis and order further testing such as an MRI of the brain or lab work. When unsure of a PD diagnosis, a DaTscan can also be considered but is not needed in all cases.
            </Text>
            <Text style={styles.subHeader}>What is a DaTscan and what role does it play in a Parkinson’s diagnosis?</Text>
            <Text style={styles.contentText}>
              In 2011, the FDA approved the use of a scan called a dopamine transporter scan (DaTscan). A DaTscan is an imaging technology that allows visualization of the dopamine system in the brain. It is similar to an MRI, but instead of looking at the structure of the brain it looks at the function. A DaTscan can show if there is reduced function of the dopamine system in an area of the brain involved in controlling movement.
            </Text>
            <Text style={styles.contentText}>
              A DaTscan involves injection of a small amount of a radioactive drug that is then measured by a single-photon emission computed tomography scanner (SPECT scanner). The SPECT scanner measures the levels and location of the drug in the brain.
            </Text>
            <Text style={styles.contentText}>
              A negative DaTscan suggests that a person does not have Parkinson’s. It is important to know that a negative DaTscan does not rule out PD, especially early in the disease, but a positive DaTscan can help confirm it. A positive DaTscan can differentiate PD from essential tremor (ET) as there is no dopamine deficiency in the latter. However, DaTscan abnormalities can be seen in PD as well as other forms of atypical parkinsonism that cause a loss of dopamine (Progressive Supranuclear Palsy, Multiple System Atrophy, Corticobasal Syndrome). This means that a positive result does not differentiate Parkinson’s disease from other forms of atypical parkinsonism.
            </Text>
            <Text style={styles.subHeader}>I have PD and several symptoms. Should I get a DaTscan?</Text>
            <Text style={styles.contentText}>
              In many cases, a DaTscan is not needed to diagnose Parkinson’s disease. There is no need for DaTscan when your history and exam are typical for Parkinson’s disease and you meet the diagnostic criteria. Occasionally, if signs and symptoms are mild or you don’t meet the diagnostic criteria, your doctor will refer you for a DaT scan.
            </Text>
            <Text style={styles.contentText}>
              Another reason physicians may order a DaTscan may be to help inform their diagnosis of Parkinson’s disease if you have an unsatisfying response to therapy. Keep in mind that ultimately the diagnosis is based on your history and physical exam. The DaT scan is most commonly used to complete the picture and is not a test for a diagnosis.
            </Text>
            <Text style={styles.contentText}>
              There is no need for DaTscan when your history and exam suggest Parkinson’s disease and you meet the diagnostic criteria. Occasionally, if signs and symptoms are mild or you don’t meet the diagnostic criteria, your doctor will refer you for a DaT scan. Keep in mind that ultimately the diagnosis is based on your history and physical exam. The DaT scan is most commonly used to complete the picture and is not a test for a diagnosis.
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.parkinson.org')}>
              <Text style={styles.linkText}>Source: Parkinson's Foundation</Text>
            </TouchableOpacity>
          </>
        );
      case 'Nutrition for Parkinson’s Disease':
        return (
          <>
            <Text style={styles.contentText}>
              A balanced diet is a foundation of good health. For people with Parkinson’s disease (PD), a balanced diet is even more important. In PD, there are some foods that may help to ease symptoms and help brain health, while others can affect the way medications work. While there are many things about PD that cannot be changed, the informed choice of diet can help people to live better with the disease.
            </Text>
            <Text style={styles.subHeader}>Foods That Promote Brain Health</Text>
            <Text style={styles.contentText}>
              In the science of brain health, we often use the word neuroprotection: the process by which we can support the health of brain cells and their ability to communicate with one another. Over the years, various food groups have been studied in animals and in large epidemiological studies of human populations for their potential to promote brain health. Initial research has provided some evidence about possible benefits of certain foods. Although there isn’t yet evidence about the specific benefits for Parkinson’s disease, what we do know is that these foods are part of a healthy diet.
            </Text>
            <Text style={styles.subHeader}>Neuroprotection</Text>
            <Text style={styles.contentText}>
              Of all the foods that have been studied for their potential to promote brain health, research into nuts and herbs has shown promise. Here is what we know.
            </Text>
              <Text style={styles.contentText}>• <Text style={styles.boldText}>Walnuts.</Text> Walnuts contain an essential fatty acid called omega 3 and a variety of minerals, which early studies associate with a decreased risk for dementia. Try eating five to 10 each day.</Text>
            <Text style={styles.contentText}>• <Text style={styles.boldText}>Pistachios.</Text> Emerging evidence shows these nuts (the vitamin K and antioxidants in them) may have potential for helping to reestablish lost connections between neurons. They also contain a small amount of lithium, which may help to improve mood. You can eat a few of them two or three times a week.</Text>
            <Text style={styles.contentText}>• <Text style={styles.boldText}>Macadamia nuts.</Text> Oils in these nuts may increase the production of neurotransmitters that help brain cells communicate with each other. They are high in calories, but a few a day is good for you.</Text>
            <Text style={styles.contentText}>• <Text style={styles.boldText}>Cashews.</Text> Iron, zinc and magnesium in cashews may boost serotonin — a neurotransmitter linked to good mood — and may reduce memory loss.</Text>
            <Text style={styles.contentText}>• <Text style={styles.boldText}>Almonds.</Text> Although they have little effect on brain health, almonds contain fiber, which helps relieve constipation (a common symptom in PD).</Text>
            <Text style={styles.contentText}>• <Text style={styles.boldText}>Brazil nuts.</Text> These nuts contain selenium, a mineral that may have the potential to counteract environmental toxins like pesticides and herbicides. Eat no more than one or two a day.</Text>
            <Text style={styles.contentText}>• <Text style={styles.boldText}>Turmeric.</Text> This spice turns Indian food orange, and its active ingredient is curcumin. Add turmeric to food, but don’t take it as a supplement.</Text>
            <Text style={styles.contentText}>• <Text style={styles.boldText}>Ceylon cinnamon.</Text> In animal studies, this spice has shown potential for normalizing neurotransmitter levels and other PD brain changes. Look for Ceylon cinnamon, which is grown in Sri Lanka and labeled as such. Organic cinnamon is also preferable.</Text>
            <Text style={styles.subHeader}>Anti-Inflammatory Foods</Text>
            <Text style={styles.contentText}>
              Fighting inflammation can be another important strategy for keeping the brain healthy. The types of fats you consume may play a role in reducing inflammation in the body, and those known as “medium-chain triglycerides” may be particularly helpful. Coconut oil contains this fat. You can cook with it just as you would with olive oil. Other anti-inflammatory foods include rosemary, oily fish, like salmon, tuna and mackerel, dark leafy green vegetables, like kale, collard greens and spinach and soy products.
            </Text>
            <Text style={styles.subHeader}>Benefits of Purple and Red</Text>
            <Text style={styles.contentText}>
              Foods that contain antioxidants may also protect brain health. Antioxidants counteract molecules known as “free radicals,” which can damage healthy cells including neurons. Fruits that are purple and red, like blueberries and raspberries, contain pigments called anthocyanins, which are well-known antioxidants. Some studies suggest that drinking green tea (three cups a day) is neuroprotective, because EGCG, found in green tea, is both an anti-inflammatory agent and an antioxidant.
            </Text>
            <Text style={styles.subHeader}>Foods for PD Symptoms</Text>
            <Text style={styles.contentText}>
              Nutrition adjustments can help ease some of PD’s most common symptoms, both of a motor and a non-motor nature. If you experience digestive difficulties, especially constipation (which is very common in PD), try to drink more fluids, and increase your fiber intake with fruits and vegetables such as kiwi, apples, prunes, dates, figs, radishes, berries, nuts and beans. Probiotic supplements like Bifidobacterium (B. breve, B. adolentis and B. infantis), that add healthy bacteria to the gut, may also be helpful.
            </Text>
            <Text style={styles.contentText}>
              If drinking more water leads to urinary incontinence or urgency, increase your fluid intake by eating foods with a high water content such as tomato, cucumber, radish, celery, broccoli and grapefruit. If you struggle with weight loss or loss of appetite, try increasing your calorie intake by eating nuts and foods that contain healthy fats, like coconut and avocado. To stimulate your appetite, try bitter greens like collard and beet greens, or spicy foods. Exercise can increase muscle mass and hunger.
            </Text>
            <Text style={styles.contentText}>
              Fatigue and sleep difficulties are also common symptoms of PD. The culprit of these problems may be sugar. When eaten during the day, sweets briefly boost energy, but make you sleepy later. When eaten in the evening, they may keep you awake.
            </Text>
            <Text style={styles.contentText}>
              Another reason to limit sugar is that it causes a spike in blood glucose, which contributes to inflammation. When reaching for a snack, try foods that offer a balance of protein and fat, like nuts or avocado, or whole-grain complex carbohydrates, like brown rice and quinoa.
            </Text>
            <Text style={styles.subHeader}>How Foods Affect PD Medication</Text>
            <Text style={styles.contentText}>
              Another benefit of dietary changes can be improvement in the effectiveness of PD medications. Taking medications at mealtime can affect how quickly they are absorbed into your system, and the rate at which your body uses, or metabolizes them. If you take carbidopa/levodopa (Sinemet) for PD symptoms, you may find that protein-rich foods such as meat, fish, eggs or dairy products, or high-fat foods, lengthen the time it takes for the medicine to kick in, or make the medication less effective.
            </Text>
            <Text style={styles.contentText}>
                The solution?<Text style={styles.boldText}> Talk to your doctor about taking levodopa 30-60 minutes before a meal or 1-2 hours after finishing a meal.</Text> Be aware that high-protein and high-fat snacks can also interfere with levodopa. Your doctor or a nutritionist can give advice on how to schedule the protein you eat, to avoid having it interfere with levodopa.
            </Text>
            <Text style={styles.subHeader}>Conclusion</Text>
            <Text style={styles.contentText}>
              People with PD need to eat a balanced diet in order to feel their best and maintain energy. Eating more nuts and berries, cutting back on fried food and sweets, and cooking with herbs are all elements of sound nutrition and they may also help you manage your PD.
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.parkinson.org')}>
              <Text style={styles.linkText}>Source: Parkinson's Foundation</Text>
            </TouchableOpacity>
          </>
        );
      default:
        return 'No information available.';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.ellipsesContainer}>
        <Image source={require('../../assets/images/ellipse1.png')} style={styles.ellipse} />
        <Image source={require('../../assets/images/ellipse2.png')} style={[styles.ellipse, styles.secondEllipsePosition]} />
      </View>
      <TouchableOpacity style={styles.avatarTouchable} onPress={() => navigation.navigate('AvatarPage')}>
        <Image
          source={avatarUri ? { uri: avatarUri } : require('../../assets/images/avatar.png')}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <Text style={styles.header}>{title}</Text>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {getContent()}
      </ScrollView>
      <View style={styles.bottomBar}></View>
    </View>
  );
};

export default TopicDetailScreen;
