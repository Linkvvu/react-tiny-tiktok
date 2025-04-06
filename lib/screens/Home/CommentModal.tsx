import React, { useState } from "react"
import { FlatList, Modal, StyleSheet, Pressable, View, Text, KeyboardAvoidingView, Platform, TextInput } from "react-native"
import Button from "../../components/Button"
import { globalStyles } from "../../styles/globalStyles"
import { DoComment, FetchComments } from "../../services/VideoService"
import { useAuth } from "../../contexts/AuthContext"
import { CommentInfo } from "../../types"
import Avatar from "../../components/Avatar"
import { DefaultImages, formatNickname, formatNumber, formatTimestampSec } from "../../utils/common"
import { COLORS, FONT_SIZES } from "../../constants/common"
import assert from "assert"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

interface CommentModalProps {
  vid: number
  commentCnt: number
  visible: boolean
  onClose: () => void
  incrCommentCount: () => void
}

const CommentModal: React.FC<CommentModalProps> = ({
  vid,
  visible,
  onClose,
  commentCnt,
  incrCommentCount
}) => {
  const AuthCtx = useAuth()
  const [commentList, setCommentList] = useState<CommentInfo[] | null>(null)
  const [newComment, setNewComment] = useState('')

  async function fetchComments() {
    const comments = await FetchComments(vid, AuthCtx.authData ? AuthCtx.authData.token : '')
    console.log('comment-list: ', comments)
    if (!AuthCtx.authData && comments) {
      // just show 10 comments if not login
      setCommentList(comments.splice(0, 10))
      return
    }
    setCommentList(comments)
  }

  async function doComment() {
    assert(AuthCtx.authData)
    if (!newComment) {
      // TODO: hint the input cannot be empty
      return
    }
    const comment = await DoComment(vid, 0, newComment, AuthCtx.authData.token)
    //TODO: handle do comment fail
    console.log('comment successful: ', comment)
    if (comment) {
      setCommentList((prev) => [comment, ...(prev || [])])
      setNewComment('')
      incrCommentCount()
    }
  }

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onShow={fetchComments}
    >
      <View style={globalStyles.simpleContainer}>
        <Pressable style={globalStyles.simpleContainer} onPress={onClose} />
        <View style={styles.commentCard}>
          <View style={styles.dragHandle} />

          <FlatList
            data={commentList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCommentItem}
            ListHeaderComponent={<TotalDisplay total={commentCnt} />}
            ListFooterComponent={!AuthCtx.authData ? <LoginButton /> : null}
          />

          {
            AuthCtx.authData &&
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="添加评论..."
                  value={newComment}
                  onChangeText={setNewComment}
                  returnKeyType='send'
                  onSubmitEditing={doComment}
                />
              </View>
            </KeyboardAvoidingView>
          }
        </View>
      </View>
    </Modal>
  )
}

const TotalDisplay: React.FC<{ total: number }> = ({ total }) => {
  return (
    <View style={styles.totalDisplay}>
      <Text style={{ fontSize: FONT_SIZES.SMALL }}>{formatNumber(total, '暂无评论', '条评论')}</Text>
    </View>
  )
}

const LoginButton = () => {
  const navigation = useNavigation()
  function handleNotLogin() {
    navigation?.getParent<NativeStackNavigationProp<any>>().push("Auth")
  }

  return (
    <Button
      style={styles.loginButton}
      textStyle={styles.loginButtonText}
      title="登录看更多精彩评论 ➪"
      onPress={handleNotLogin}
    />
  )
}


const renderCommentItem = ({ item }: { item: CommentInfo }) => {
  return (
    <View style={styles.commentItem}>
      <Avatar
        source={item.commenter.avatar_url ? { uri: item.commenter.avatar_url } : DefaultImages.avatar}
        style={{ marginRight: 12 }}
      />
      <View style={[styles.commentContent]}>
        <Text style={styles.nicknameText}>{formatNickname(item.commenter.nickname, item.commenter.username)}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
        <Text style={styles.commentMeta}>{formatTimestampSec(item.create_at)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  commentCard: {
    height: '60%',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#fff'
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 8
  },
  commentItem: {
    flexDirection: 'row',
    padding: 12,
  },
  commentContent: {
    flex: 1,
    marginRight: 8
  },
  nicknameText: {
    fontSize: FONT_SIZES.SMALL,
    color: 'grey',
    marginBottom: 4
  },
  commentText: {
    fontSize: FONT_SIZES.MEDIUM,
    marginBottom: 4
  },
  commentMeta: {
    color: 'grey',
    fontSize: FONT_SIZES.SMALL
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.DISABLE
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  loginButton: {
    backgroundColor: '#fff',
  },
  loginButtonText: {
    fontSize: 14,
    color: COLORS.MAJOR,
    fontWeight: 'bold'
  },
  totalDisplay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default CommentModal;