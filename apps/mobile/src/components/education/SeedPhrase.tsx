import React, { ComponentProps, ReactNode, useCallback, useContext, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import { OnboardingStackBaseParams, useOnboardingStackNavigation } from 'src/app/navigation/types'
import { CloseButton } from 'src/components/buttons/CloseButton'
import { CarouselContext } from 'src/components/carousel/Carousel'
import { OnboardingScreens } from 'src/screens/Screens'
import { Flex, Text, useDeviceDimensions } from 'ui/src'
import { getCloudProviderName } from 'wallet/src/utils/platform'

function Page({
  text,
  params,
}: {
  text: ReactNode
  params: OnboardingStackBaseParams
}): JSX.Element {
  const { t } = useTranslation()
  const { fullWidth } = useDeviceDimensions()
  const { goToPrev, goToNext } = useContext(CarouselContext)
  const navigation = useOnboardingStackNavigation()

  const onDismiss = useCallback((): void => {
    navigation.navigate(OnboardingScreens.Backup, params)
  }, [navigation, params])

  const slideChangeGesture = useMemo(
    () =>
      Gesture.Tap().onEnd(({ absoluteX }) => {
        if (absoluteX < fullWidth * 0.33) {
          runOnJS(goToPrev)()
        } else {
          runOnJS(goToNext)()
        }
      }),
    [goToPrev, goToNext, fullWidth]
  )

  const dismissGesture = useMemo(
    () =>
      Gesture.Tap().onEnd(() => {
        runOnJS(onDismiss)()
      }),
    [onDismiss]
  )

  return (
    <Flex fill>
      <GestureDetector gesture={slideChangeGesture}>
        <Flex centered gap="$spacing16">
          <Flex
            row
            alignItems="center"
            justifyContent="space-between"
            px="$spacing24"
            width={fullWidth}>
            <Text color="$neutral2" variant="subheading2">
              {t('onboarding.tooltip.recoveryPhrase.trigger')}
            </Text>
            <GestureDetector gesture={dismissGesture}>
              <CloseButton color="$neutral2" onPress={(): void => undefined} />
            </GestureDetector>
          </Flex>
          <Flex flex={0.2} />
          <Flex flex={0.8} px="$spacing24">
            <CustomHeadingText>{text}</CustomHeadingText>
          </Flex>
        </Flex>
      </GestureDetector>
    </Flex>
  )
}

const cloudProviderName = getCloudProviderName()
export const SeedPhraseEducationContent = (params: OnboardingStackBaseParams): JSX.Element[] => [
  <Page
    params={params}
    text={
      <CustomHeadingText>
        <Trans i18nKey="account.seedPhrase.education.part1">
          A recovery phrase (or seed phrase) is a
          <CustomHeadingText color="$accent1">set of words</CustomHeadingText> required to access
          your wallet, <CustomHeadingText color="$accent1">like a password.</CustomHeadingText>
        </Trans>
      </CustomHeadingText>
    }
  />,
  <Page
    params={params}
    text={
      <CustomHeadingText>
        <Trans i18nKey="account.seedPhrase.education.part2">
          You can <CustomHeadingText color="$accent1">enter</CustomHeadingText> your recovery phrase
          on a new device
          <CustomHeadingText color="$accent1">to restore your wallet</CustomHeadingText> and its
          contents.
        </Trans>
      </CustomHeadingText>
    }
  />,
  <Page
    params={params}
    text={
      <CustomHeadingText>
        <Trans i18nKey="account.seedPhrase.education.part3">
          But, if you
          <CustomHeadingText color="$accent1">lose your recovery phrase</CustomHeadingText>, you’ll
          <CustomHeadingText color="$accent1">lose access</CustomHeadingText> to your wallet.
        </Trans>
      </CustomHeadingText>
    }
  />,
  <Page
    params={params}
    text={
      <CustomHeadingText>
        <Trans i18nKey="account.seedPhrase.education.part4">
          Instead of memorizing your recovery phrase, you can
          <CustomHeadingText color="$accent1">
            back it up to {{ cloudProviderName }}
          </CustomHeadingText>
          and protect it with a password.
        </Trans>
      </CustomHeadingText>
    }
  />,
  <Page
    params={params}
    text={
      <CustomHeadingText>
        <Trans i18nKey="account.seedPhrase.education.part5">
          You can also manually back up your recovery phrase by
          <CustomHeadingText color="$accent1">writing it down</CustomHeadingText> and storing it in
          a safe place.
        </Trans>
      </CustomHeadingText>
    }
  />,
  <Page
    params={params}
    text={
      <CustomHeadingText>
        <Trans i18nKey="account.seedPhrase.education.part6">
          We recommend using
          <CustomHeadingText color="$accent1">both types of backups</CustomHeadingText>, because if
          you lose your recovery phrase, you won’t be able to restore your wallet.
        </Trans>
      </CustomHeadingText>
    }
  />,
]

function CustomHeadingText(props: ComponentProps<typeof Text>): JSX.Element {
  return <Text fontSize={28} lineHeight={34} variant="heading2" {...props} />
}
