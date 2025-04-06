import { ActivityIndicator, View, ViewStyle } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import { COLORS } from "../constants/common"

export const LoadingIndicator = ({ style }: { style?: ViewStyle }) => (
  <View style={[globalStyles.indicatorContainer, style]}>
    <ActivityIndicator size='large' color={COLORS.MAJOR} />
  </View>
)