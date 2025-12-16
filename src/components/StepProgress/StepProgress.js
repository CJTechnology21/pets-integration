import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';

const StepProgress = ({ totalSteps = 1, currentStep = 1 }) => {
  const safeTotalSteps = Math.max(totalSteps, 1);
  const steps = useMemo(
    () => Array.from({ length: safeTotalSteps }, (_, index) => index + 1),
    [safeTotalSteps]
  );

  const connectorAnimations = useRef(
    steps.length > 1 ? steps.slice(0, -1).map(() => new Animated.Value(0)) : []
  ).current;

  useEffect(() => {
    connectorAnimations.forEach((anim, index) => {
      const targetValue = currentStep - 1 > index ? 1 : 0;
      Animated.timing(anim, {
        toValue: targetValue,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  }, [currentStep, connectorAnimations]);

  return (
    <View style={styles.stepProgressContainer}>
      {steps.map((step, index) => {
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;
        const connectorValue = connectorAnimations[index];
        return (
          <React.Fragment key={`progress-step-${step}`}>
            <View
              style={[
                styles.stepCircle,
                (isCompleted || isActive) && styles.stepCircleActive,
                isCompleted && styles.stepCircleCompleted,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  (isCompleted || isActive) && styles.stepNumberActive,
                  isCompleted && styles.stepNumberFilled,
                ]}
              >
                {step}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View style={styles.connectorTrack}>
                <Animated.View
                  style={[
                    styles.connectorFill,
                    connectorValue && {
                      width: connectorValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  stepProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(16),
  },
  stepCircle: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    borderWidth: 2,
    borderColor: COLORS.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  stepCircleActive: {
    borderColor: COLORS.primary2,
  },
  stepCircleCompleted: {
    borderColor: COLORS.primary2,
    backgroundColor: COLORS.primary2,
  },
  stepNumber: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.SeniBold,
    color: COLORS.textGrey,
  },
  stepNumberActive: {
    color: COLORS.primary2,
  },
  stepNumberFilled: {
    color: COLORS.white,
  },
  connectorTrack: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.lightGrey,
    marginHorizontal: scale(6),
    borderRadius: scale(1),
    overflow: 'hidden',
  },
  connectorFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primary2,
  },
});

export default StepProgress;

