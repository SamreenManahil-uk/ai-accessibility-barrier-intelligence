# AI Accessibility Barrier Intelligence
## Day 1 and Day 2 Detailed ML / Computer Vision Notes

# Project Overview

The aim of this project is to detect physical accessibility barriers from environmental images using computer vision and deep learning.

The system is designed to identify objects and environmental features that may affect people with mobility difficulties.

Examples include stairs, potholes, physical obstacles, road barriers, poles, vehicles, sidewalks, ramps and other path-related objects.

The project uses object detection rather than simple image classification because the application needs to identify both the type of object and its exact location in the image.

The main technologies used in the machine-learning part of the project are Python, PyTorch, Ultralytics YOLO, OpenCV and Pandas.

---

# DAY 1

## 1. Main Objective of Day 1

Day 1 focused on creating the complete machine-learning and computer-vision foundation of the project.

The main tasks completed were:

- Git repository setup
- GitHub repository connection
- Python virtual environment creation
- Machine-learning library installation
- Apple MPS GPU verification
- Initial pretrained YOLO inference
- Real public dataset selection
- Dataset inspection
- Accessibility class selection
- Annotation preprocessing
- Polygon-to-bounding-box conversion
- YOLO label validation
- Smoke training

---

## 2. Python Environment

Python 3.12 was selected for the project.

A virtual environment named `.venv` was created.

The purpose of a virtual environment is to keep the project dependencies isolated from the rest of the computer.

This prevents dependency conflicts between different Python projects.

Important libraries installed include:

- PyTorch
- Ultralytics
- OpenCV
- NumPy
- Roboflow SDK
- Pandas

---

## 3. PyTorch

PyTorch is the main deep-learning framework used in the project.

It is responsible for:

- tensor calculations
- neural-network operations
- model training
- automatic differentiation
- gradient calculation
- GPU acceleration
- model inference

Ultralytics YOLO uses PyTorch internally.

PyTorch was chosen because it has strong support for modern computer-vision models and integrates well with YOLO.

---

## 4. Apple MPS Acceleration

The project is being developed on an Apple M1 Max MacBook.

PyTorch MPS support was verified.

MPS stands for Metal Performance Shaders.

MPS allows PyTorch to use the Apple GPU instead of relying only on CPU processing.

For training and inference, the project uses:

`device=mps`

This improves training and inference performance on Apple Silicon.

---

## 5. Computer Vision

Computer vision is used because the project must analyse visual information from uploaded images.

The system needs to detect physical environmental features such as stairs, potholes, obstacles and road barriers.

These are visual objects, so computer vision is the appropriate AI domain for this problem.

---

## 6. Why Object Detection Was Selected

Image classification predicts one or more labels for an entire image.

For example, classification could tell us that an image contains stairs.

However, this project needs more information.

The system must know:

- what object was detected
- where the object is located
- how confident the model is

Object detection provides:

- class label
- confidence score
- bounding-box coordinates

This is necessary because the frontend will later display detection boxes over the uploaded image.

---

## 7. YOLO

YOLO stands for You Only Look Once.

YOLO is an object-detection architecture designed for fast detection.

It was selected because it provides:

- object classification
- bounding-box localisation
- confidence scores
- fast inference
- relatively simple deployment
- good integration with PyTorch
- strong support through Ultralytics

Alternative object-detection models include Faster R-CNN, SSD, RetinaNet and Detectron2-based models.

YOLO was preferred because the future application should return results quickly after an image is uploaded.

---

## 8. Initial Pretrained YOLO Test

Before training a custom accessibility model, a pretrained YOLO model was tested.

This test confirmed that:

- PyTorch was working
- Ultralytics was installed correctly
- images could be loaded
- inference worked
- detected objects could be returned
- bounding boxes could be generated

This initial test was important because it verified the technical environment before custom model training started.

---

## 9. Dataset Selection

A real public wheelchair and accessibility-related dataset was selected.

The dataset contained approximately 14,437 images and 21 original classes.

The dataset was downloaded using Roboflow.

Roboflow is being used only for dataset management and download.

The final application is not intended to depend on Roboflow-hosted inference.

The trained YOLO model will run locally as part of the project.

---

## 10. Original Dataset Review

The original dataset contained 21 classes.

Not all of these classes were necessary for the accessibility-barrier use case.

The dataset was therefore reviewed and filtered.

The goal was to keep the model focused on objects that are more relevant to accessibility analysis.

---

## 11. Final 12 Classes

The following 12 classes were selected:

1. Crosswalk
2. Obstacle
3. Pole
4. Pothole
5. Ramp
6. Road-barrier
7. Sidewalk
8. Stairs
9. Tree
10. Vehicle
11. bench
12. fire-hydrant

These classes were selected because they are more relevant to path accessibility and environmental navigation.

---

## 12. Why the Number of Classes Was Reduced

The original dataset contained more general street-scene categories.

Keeping all 21 classes would have introduced unnecessary complexity.

Reducing the dataset to 12 relevant classes helped:

- keep the model focused
- reduce irrelevant predictions
- align training with the project objective
- make evaluation easier
- improve the clarity of the final application

---

## 13. Annotation Format Problem

The downloaded dataset contained polygon-style annotations.

Standard YOLO object detection usually expects five values per annotation:

`class_id x_center y_center width height`

Polygon annotations can contain several coordinate pairs.

Because the project is performing object detection rather than segmentation, the polygon annotations needed to be converted to rectangular bounding boxes.

---

## 14. Polygon-to-Bounding-Box Conversion

A custom Python preprocessing script was created.

For each polygon, the script calculated:

- minimum x coordinate
- maximum x coordinate
- minimum y coordinate
- maximum y coordinate

These values were then converted into a rectangular bounding box.

The rectangular box was finally converted into standard YOLO format.

This allowed the dataset to be used for object-detection training.

---

## 15. Dataset Preprocessing Script

The preprocessing script performs the following tasks:

- reads original annotations
- checks the original class ID
- keeps only the selected accessibility classes
- remaps class IDs
- detects polygon-style labels
- converts polygons into bounding boxes
- writes new YOLO labels
- prepares processed train, validation and test folders
- creates a new data.yaml configuration file
- verifies annotation format

This script makes the dataset preparation process reproducible.

---

## 16. Final Processed Dataset

The final processed dataset contains:

- Training images: 10,406
- Validation images: 2,577
- Test images: 1,454

The total number of retained accessibility annotations was:

26,868

Malformed or skipped annotations:

0

All processed annotations were successfully verified as valid YOLO detection labels.

---

## 17. Final Class Distribution

The final retained annotation counts were:

- Crosswalk: 587
- Obstacle: 3,198
- Pole: 4,534
- Pothole: 1,568
- Ramp: 155
- Road-barrier: 304
- Sidewalk: 2,902
- Stairs: 1,375
- Tree: 1,700
- Vehicle: 6,979
- bench: 907
- fire-hydrant: 2,659

Total annotations:

26,868

---

## 18. Dataset Imbalance

The dataset is imbalanced.

Some classes contain thousands of examples, while some contain only a few hundred or fewer.

For example:

- Vehicle: 6,979 examples
- Pole: 4,534 examples
- Ramp: 155 examples
- Road-barrier: 304 examples

This imbalance can affect model performance.

Classes with more training examples are generally easier for the model to learn.

Classes with fewer examples may show lower recall or lower mAP.

This is an important limitation of the dataset.

---

## 19. Transfer Learning

Transfer learning was used instead of training the model completely from scratch.

A pretrained model already understands many general visual features such as:

- edges
- shapes
- textures
- object boundaries
- general visual patterns

The pretrained model was fine-tuned on the accessibility dataset.

Benefits of transfer learning include:

- faster training
- reduced data requirements
- better starting performance
- improved practicality for a portfolio project

---

## 20. Base Model

The selected model was YOLO26n.

The `n` version is a lightweight YOLO variant.

A lightweight model was useful because the project needs a reasonable balance between:

- speed
- model size
- training time
- inference performance
- deployment simplicity

---

## 21. Smoke Training

A two-epoch smoke test was performed before proper training.

A smoke test is a short training run used to verify that the pipeline works.

The purpose was not to achieve final performance.

The smoke test verified that:

- the dataset could be loaded
- labels were valid
- YOLO could train
- MPS acceleration worked
- validation worked
- model weights could be saved

---

## 22. Smoke-Test Metrics

The approximate smoke-test validation results were:

- Precision: 0.686
- Recall: 0.416
- mAP@0.5: 0.467
- mAP@0.5:0.95: 0.303

These metrics were not considered final results.

The purpose of the smoke test was to validate the training pipeline.

---

## 23. Important Day 1 Outcome

The most important result of Day 1 was the successful creation of a complete and reproducible machine-learning foundation.

By the end of Day 1, the project had:

- a real public dataset
- a preprocessing script
- 12 relevant classes
- valid YOLO labels
- a working YOLO environment
- Apple MPS acceleration
- successful model training
- saved model checkpoints

---

# DAY 2

## 24. Main Objective of Day 2

Day 2 focused on proper model training and evaluation.

The major tasks were:

- 10-epoch baseline training
- validation
- test-set evaluation
- Precision measurement
- Recall measurement
- mAP evaluation
- per-class analysis
- confusion-matrix generation
- model checkpoint creation
- accessibility risk engine
- end-to-end inference pipeline

---

## 25. Baseline Training Configuration

The main training configuration was:

- Model: YOLO26n
- Epochs: 10
- Image size: 640
- Batch size: 8
- Device: Apple MPS
- Validation: enabled

Ultralytics automatically selected AdamW as the optimizer.

---

## 26. Epoch Meaning

An epoch represents one complete pass through the training dataset.

For example, 10 epochs means the model processes the training dataset approximately ten times.

During each epoch, the neural network updates its parameters based on prediction errors.

The goal is to progressively improve object localisation and classification.

---

## 27. Training Losses

The YOLO training output contains several losses.

Important losses include box loss and classification loss.

Box loss measures how accurately the predicted bounding boxes match the true object locations.

Classification loss measures how accurately the model identifies the correct object category.

Generally, lower loss values indicate improvement, although validation metrics are more important for deciding how well the model generalises.

---

## 28. Validation Data

Validation data is separate from the training data.

The model does not directly update its parameters using validation images.

Validation is used to measure generalisation during development.

It is useful for:

- monitoring training
- comparing epochs
- detecting overfitting
- selecting the best model checkpoint

---

## 29. Validation Results

After 10 epochs, the validation results were approximately:

- Precision: 0.725
- Recall: 0.558
- mAP@0.5: 0.603
- mAP@0.5:0.95: 0.410

These results showed a clear improvement compared with the earlier two-epoch smoke test.

---

## 30. Model Checkpoints

Training generated two important model files:

- best.pt
- last.pt

The `best.pt` file represents the best-performing validation checkpoint saved during training.

The `last.pt` file represents the state of the model at the final training epoch.

For inference and deployment, the project uses `best.pt`.

---

## 31. Model Size

The trained model file was approximately 5.1 MB.

This is relatively small for a deep-learning object detector.

A small model size is useful because it makes the model easier to:

- store
- load
- deploy
- transfer between environments

---

## 32. Training Outputs

Ultralytics automatically generated several evaluation artefacts.

These included:

- Precision curve
- Recall curve
- Precision-Recall curve
- F1 curve
- confusion matrix
- normalized confusion matrix
- training results CSV
- results plot
- validation prediction images
- training batch images

These outputs provide evidence of model performance and are useful for project documentation and evaluation.

---

## 33. Separate Test Set

The test set was kept separate from the training process.

The test set contained:

- 1,454 images
- 3,379 object instances

The purpose of the test set is to provide a more realistic evaluation of performance on unseen data.

Validation data helps during development, while test data is used for final evaluation.

---

## 34. Final Test Metrics

The final test-set results were:

- Precision: 0.712
- Recall: 0.528
- mAP@0.5: 0.574
- mAP@0.5:0.95: 0.389

These values represent the main baseline test performance of the current model.

---

## 35. Precision

Precision measures how many model predictions were correct.

Conceptually:

Precision = Correct positive detections divided by all positive predictions.

High precision means the model produces fewer false-positive detections.

Example:

If the model predicts 100 barriers and 80 are correct, precision would be approximately 80 percent.

---

## 36. Recall

Recall measures how many real objects the model successfully detected.

Conceptually:

Recall = Correct detections divided by all real objects.

High recall means fewer actual objects are missed.

Recall is particularly important in an accessibility application because missing a real barrier may be more important than producing an occasional incorrect detection.

---

## 37. Intersection over Union

Intersection over Union, or IoU, measures how much the predicted bounding box overlaps the real bounding box.

A higher IoU means the predicted location is closer to the true object location.

IoU is important for object-detection evaluation.

---

## 38. mAP@0.5

mAP stands for mean Average Precision.

mAP@0.5 evaluates detections using an IoU threshold of 0.5.

It combines detection quality across the model's classes.

A higher mAP value indicates better object-detection performance.

---

## 39. mAP@0.5:0.95

mAP@0.5:0.95 is a stricter metric.

Instead of evaluating only at an IoU threshold of 0.5, it evaluates across multiple thresholds from 0.50 to 0.95.

It therefore provides a more demanding measure of bounding-box quality.

---

## 40. Per-Class Test Results

Approximate test-set results were:

Crosswalk:
- Precision: 0.496
- Recall: 0.405
- mAP@0.5: 0.436
- mAP@0.5:0.95: 0.283

Obstacle:
- Precision: 0.669
- Recall: 0.331
- mAP@0.5: 0.425
- mAP@0.5:0.95: 0.239

Pole:
- Precision: 0.684
- Recall: 0.529
- mAP@0.5: 0.637
- mAP@0.5:0.95: 0.400

Pothole:
- Precision: 0.586
- Recall: 0.310
- mAP@0.5: 0.300
- mAP@0.5:0.95: 0.153

Ramp:
- Precision: 1.000
- Recall: 0.000
- mAP@0.5: 0.050
- mAP@0.5:0.95: 0.034

Road-barrier:
- Precision: 0.512
- Recall: 0.749
- mAP@0.5: 0.713
- mAP@0.5:0.95: 0.353

Sidewalk:
- Precision: 0.738
- Recall: 0.719
- mAP@0.5: 0.721
- mAP@0.5:0.95: 0.497

Stairs:
- Precision: 0.702
- Recall: 0.403
- mAP@0.5: 0.452
- mAP@0.5:0.95: 0.279

Tree:
- Precision: 0.651
- Recall: 0.546
- mAP@0.5: 0.633
- mAP@0.5:0.95: 0.469

Vehicle:
- Precision: 0.726
- Recall: 0.618
- mAP@0.5: 0.696
- mAP@0.5:0.95: 0.469

bench:
- Precision: 0.923
- Recall: 0.966
- mAP@0.5: 0.974
- mAP@0.5:0.95: 0.887

fire-hydrant:
- Precision: 0.851
- Recall: 0.757
- mAP@0.5: 0.847
- mAP@0.5:0.95: 0.602

---

## 41. Stronger Classes

The strongest current classes include:

- bench
- fire-hydrant
- Sidewalk
- Road-barrier
- Vehicle

These classes generally achieved stronger mAP values on the test set.

---

## 42. Weaker Classes

The weaker classes currently include:

- Ramp
- Pothole
- Stairs
- Obstacle

The weak Ramp result is especially important.

The dataset contains only 155 Ramp annotations in total.

The test set contains only 10 Ramp instances.

This is too little data to expect robust generalisation.

The weak Ramp performance should therefore be described as a dataset limitation rather than hidden.

---

## 43. Confusion Matrix

A confusion matrix was generated automatically during evaluation.

It helps identify which object classes the model confuses with one another.

The normalized confusion matrix makes class-level error patterns easier to compare.

This information can later guide improvements such as additional training data or targeted augmentation.

---

## 44. Accessibility Risk Engine

After object detection, an explainable risk engine was created.

The risk engine is not another deep-learning model.

It is a rule-based heuristic layer.

Each detected class has an assigned risk weight.

The detection confidence is combined with that weight to calculate a risk score.

The final output is classified into:

- LOW
- MEDIUM
- HIGH

---

## 45. Why Use an Explainable Heuristic

A heuristic approach was selected because the project should clearly explain why a particular risk level was produced.

For example, if stairs and an obstacle are detected, the system can clearly state that these objects contributed to the high-risk result.

This is easier to explain than using another black-box model for risk scoring.

---

## 46. Example Risk Weights

Examples of the current heuristic include:

- Stairs: high weight
- Obstacle: high weight
- Pothole: high weight
- Road-barrier: high weight
- Vehicle: medium-to-high weight
- Pole: lower weight
- Sidewalk: no barrier weight
- Crosswalk: no barrier weight

The weights are application-level design choices.

They should not be described as medically or legally validated accessibility standards.

---

## 47. Risk Score Example

A test was performed using:

- Stairs with 91 percent confidence
- Obstacle with 84 percent confidence
- Sidewalk with 89 percent confidence

The risk engine returned:

- Risk level: HIGH
- Risk score: 7.0

The system also generated human-readable reasons for the result.

---

## 48. Important Risk Engine Limitation

The accessibility risk score is an explainable project heuristic.

It is not:

- a medical assessment
- a legal accessibility assessment
- an official accessibility certification
- a replacement for expert accessibility auditing

This limitation should always be mentioned in technical documentation and interviews.

---

## 49. End-to-End Inference Pipeline

An inference pipeline was created to connect the trained model with the risk engine.

The pipeline:

- loads `best.pt`
- receives an image path
- runs YOLO inference
- extracts object labels
- extracts confidence scores
- creates detection objects
- passes detections to the risk engine
- returns detected objects and accessibility risk information

This represents the core AI logic that will later be integrated into FastAPI.

---

## 50. Real Inference Test

The end-to-end pipeline was tested using an actual image from the test dataset.

The model detected:

Vehicle

Confidence:

approximately 37.8 percent

The risk engine returned:

- Risk level: LOW
- Risk score: 1.13

This confirmed that the trained model and the risk engine work together successfully.

---

# DAY 1 AND DAY 2 TECHNICAL DECISIONS

## 51. Why Not Train from Scratch?

Training from scratch would require:

- significantly more data
- significantly more training time
- more computational resources
- more experimentation

Transfer learning was more suitable for this project because a pretrained detector already understands useful general visual features.

---

## 52. Why Use a Real Public Dataset?

A real public dataset provides more credible model evaluation than manually invented or synthetic object-detection labels.

The project therefore uses real environmental images and real labelled objects.

This makes the project stronger for portfolio and interview purposes.

---

## 53. Why Keep Train, Validation and Test Separate?

Training data is used to update model weights.

Validation data is used to monitor model development.

Test data is used for final evaluation.

Keeping these datasets separate reduces the risk of reporting overly optimistic results.

---

## 54. Why Test Per-Class Performance?

Overall performance can hide important weaknesses.

For example, overall mAP may look acceptable even if Ramp detection is extremely poor.

Per-class metrics make these weaknesses visible.

This is especially important for accessibility applications because different barrier categories may have very different levels of importance.

---

## 55. Current Model Limitations

Current limitations include:

- severe class imbalance
- very few Ramp examples
- relatively low recall for some barriers
- only 10 training epochs
- dataset may not represent every real-world environment
- bounding boxes were generated from polygon annotations
- risk weights are heuristic
- the current model is a baseline rather than a production-certified system

---

## 56. Potential Future Improvements

Possible improvements include:

- collecting more Ramp images
- collecting more Stairs and Pothole examples
- targeted data augmentation
- longer model training
- testing larger YOLO variants
- experimenting with confidence thresholds
- hyperparameter tuning
- class-balancing strategies
- testing on external datasets
- testing on user-captured images
- manual error analysis
- comparing alternative object-detection architectures

---

# INTERVIEW QUESTIONS AND ANSWERS

## 57. Why did you use object detection instead of image classification?

I used object detection because the project needs both the object category and its location in the image. Image classification could tell me that stairs exist, but object detection also provides a bounding box and confidence score, which are required for the final user interface.

---

## 58. Why did you choose YOLO?

I selected YOLO because it provides fast object detection, bounding-box localisation and confidence scores. It also integrates well with PyTorch and is suitable for deployment in a web application where inference speed is important.

---

## 59. What is transfer learning?

Transfer learning means starting from a model that has already learned general visual patterns from a large dataset and then fine-tuning it on a new specialised dataset. It reduces training time and data requirements.

---

## 60. Why did you reduce the number of classes?

The source dataset had 21 classes, but some were not directly related to the accessibility problem. I selected 12 classes that were more relevant to mobility barriers and path accessibility so that the model would remain focused on the project objective.

---

## 61. What preprocessing challenge did you face?

The source annotations contained polygon-style coordinates instead of standard five-column YOLO detection labels. I created a preprocessing script that converted polygons into axis-aligned bounding boxes and then converted them into standard YOLO format.

---

## 62. What was the purpose of the smoke test?

The two-epoch smoke test was used to verify that the dataset, annotations, model, Apple MPS acceleration and validation pipeline all worked before spending several hours on proper training.

---

## 63. What is Precision?

Precision tells us how many predicted detections were actually correct.

A high Precision value indicates fewer false-positive detections.

---

## 64. What is Recall?

Recall tells us how many real objects were successfully detected.

High Recall means the model misses fewer actual objects.

---

## 65. Why is Recall important for this project?

In an accessibility application, missing a real physical barrier can be important. Therefore Recall is useful because it shows how many actual barriers the model successfully detects.

---

## 66. What is mAP?

mAP means mean Average Precision.

It is a standard object-detection metric that summarises detection performance across classes.

mAP@0.5 evaluates predictions at an IoU threshold of 0.5.

mAP@0.5:0.95 is stricter because it evaluates across multiple IoU thresholds.

---

## 67. Why did Ramp perform poorly?

Ramp had very few examples in the dataset.

There were only around 155 Ramp annotations overall and only 10 Ramp instances in the test set.

This severe lack of examples limits the model's ability to learn the class reliably.

---

## 68. Why did you create a risk engine?

Object detection only tells the application what was detected.

The risk engine converts detections into a more understandable accessibility-risk result.

It uses simple explainable weights so the system can explain why a LOW, MEDIUM or HIGH result was produced.

---

## 69. Is the risk score legally validated?

No.

The risk score is an explainable application heuristic created for this project.

It is not a legal, medical or certified accessibility assessment.

---

## 70. What is the current final test performance?

The current baseline test performance is approximately:

- Precision: 0.712
- Recall: 0.528
- mAP@0.5: 0.574
- mAP@0.5:0.95: 0.389

These results are based on the held-out test dataset.

---

## 71. What is the main technical achievement after Day 2?

By the end of Day 2, the project has a complete computer-vision foundation.

It includes:

- real dataset preparation
- reproducible preprocessing
- custom YOLO training
- model validation
- independent test evaluation
- per-class analysis
- saved model weights
- explainable risk scoring
- successful real-image inference

The machine-learning component is now ready to be integrated with the FastAPI backend.

---

# Short Interview Summary

During the first two days of the project, I built the complete computer-vision foundation for an AI accessibility-barrier detection system. I used a real public dataset and selected 12 accessibility-related classes from the original 21 classes. Because the source labels contained polygon annotations, I created a preprocessing script that converted them into standard YOLO bounding boxes. I then fine-tuned a pretrained YOLO26n model using PyTorch and Apple MPS acceleration. After a smoke test, I trained a 10-epoch baseline model and evaluated it on a separate test set. The model achieved approximately 0.712 Precision, 0.528 Recall, 0.574 mAP@0.5 and 0.389 mAP@0.5:0.95. I also created an explainable heuristic risk engine that converts object detections and confidence scores into LOW, MEDIUM or HIGH accessibility-risk results. Finally, I connected the trained YOLO model with the risk engine and successfully tested the complete inference pipeline on a real image.

